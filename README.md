User APIs 
--

*Link*
- https://ms-faisal-betest.herokuapp.com/ 

*Tech*
- NodeJS 
- ExpressJS
- MongoDB
- JWT
- Redis

*APIs*
- POST : /auth/signup (require body parameters: userName, accountNumber, emailAddress, identityNumber, password)
- POST : /auth/signin (require body parameters : emailAddress, password)

- GET : /user (require header: Authorization / Bearer ) (optional query parameters: accountNumber & identityNumber)  
- POST : /user (require header: Authorization / Bearer ) (require body parameters: userName, accountNumber, emailAddress, identityNumber, password)
- GET : /user/{userId} (require header: Authorization / Bearer )
- PATCH : /user/{userId} (require header: Authorization / Bearer ) (optional body parameters: userName, accountNumber, emailAddress, identityNumber, password)
- PUT : /user/{userId} (require header: Authorization / Bearer ) (optional body parameters: userName, accountNumber, emailAddress, identityNumber, password)
- DELETE : /user/{userId} (require header: Authorization / Bearer )
