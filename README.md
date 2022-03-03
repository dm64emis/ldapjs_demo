# LDAPJS demo
Sample Node app deployed in a container from WSL2 to demo LDAPJS (http://ldapjs.org/)

## To Test
return the contents of /etc/passwd using an ldap search

- terminal 1: start server
    >node ./server.js
- terminal 2: make ldap call
    >ldapsearch -H ldap://localhost:1389 -x -D cn=root -w secret -LLL -b "o=myhost" objectclass=*
