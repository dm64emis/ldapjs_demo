const fs = require('fs');
const ldap = require('ldapjs');

const server = ldap.createServer();

server.bind('cn=root', (req, res, next) => {
  if (req.dn.toString() !== 'cn=root' || req.credentials !== 'secret')
    return next(new ldap.InvalidCredentialsError());

  res.end();
  return next();
});

function authorize(req, res, next) {
  if (!req.connection.ldap.bindDN.equals('cn=root'))
    return next(new ldap.InsufficientAccessRightsError());

  return next();
}

function loadPasswdFile(req, res, next) {
  fs.readFile('/etc/passwd', 'utf8', (err, data) => {
    if (err)
      return next(new ldap.OperationsError(err.message));

    req.users = {};

    const lines = data.split('\n');
    for (const line of lines) {
      if (!line || /^#/.test(line))
        continue;

      const record = line.split(':');
      if (!record || !record.length)
        continue;

      req.users[record[0]] = {
        dn: 'cn=' + record[0] + ', ou=users, o=myhost',
        attributes: {
          cn: record[0],
          uid: record[2],
          gid: record[3],
          description: record[4],
          homedirectory: record[5],
          shell: record[6] || '',
          objectclass: 'unixUser'
        }
      };
    }

    return next();
  });
}

const pre = [authorize, loadPasswdFile];

server.search('o=myhost', pre, (req, res, next) => {
  const keys = Object.keys(req.users);
  for (const k of keys) {
    if (req.filter.matches(req.users[k].attributes))
      res.send(req.users[k]);
  }

  res.end();
  return next();
});

server.listen(1389, () => {
  console.log('/etc/passwd LDAP server up at: %s', server.url);
});