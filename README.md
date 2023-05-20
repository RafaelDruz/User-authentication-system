# user-authentication-system
 Authentication and user password recovery management
 
1 - Tecnologias utilizadas:

* O projeto é desenvolvido em JavaScript usando o ambiente de execução Node.js.
* A estrutura do aplicativo é baseada no framework Express.js, que é amplamente utilizado para criar aplicativos da web em Node.js.
* O banco de dados relacional MySQL é utilizado para armazenar os dados dos usuários.
------------------------------
2 - Recursos de segurança:

* A biblioteca bcryptjs é utilizada para criptografar as senhas dos usuários antes de armazená-las no banco de dados. Isso garante que as senhas estejam protegidas em caso de violação do banco de dados.
* O projeto utiliza tokens de autenticação para permitir o acesso seguro aos usuários. Esses tokens são gerados e validados usando a biblioteca jsonwebtoken (JWT).
* O envio de e-mails é utilizado para confirmar o cadastro do usuário e permitir a recuperação de senha. A biblioteca nodemailer é utilizada para enviar e-mails e o template de e-mail é configurado com a ajuda do nodemailer-express-handlebars.
* O projeto implementa mecanismos para validar tokens de confirmação de e-mail e tokens de redefinição de senha, garantindo que eles sejam válidos e estejam dentro do prazo de validade.
------------------------------
3 - Fluxo de autenticação:

* Os usuários podem se cadastrar fornecendo um e-mail e uma senha. A senha é criptografada antes de ser armazenada no banco de dados.
* Após o cadastro, é enviado um e-mail de confirmação com um token único para o endereço de e-mail fornecido. O usuário precisa confirmar o e-mail clicando no link fornecido no e-mail.
* Os usuários podem fazer login fornecendo seu e-mail e senha. A autenticação é feita verificando se o e-mail e a senha correspondem a um registro válido no banco de dados. Caso a conta ainda não tenha sido confirmada via e-mail, o login não será permitido.
* Em caso de esquecimento de senha, os usuários podem solicitar a redefinição da senha. É enviado um e-mail com um token de redefinição de senha válido por um curto período de tempo. Os usuários podem usar esse token para redefinir sua senha.
------------------------------
4 - Controle de permissões:

* O projeto inclui um middleware chamado "adminAuth" que é responsável por verificar se o usuário logado possui privilégios de administrador. Esse middleware é utilizado para proteger rotas específicas e garantir que apenas usuários administradores possam acessá-las.
* Uma rota "/users" é disponibilizada apenas para usuários administradores. Essa rota exibe uma lista de todos os usuários cadastrados no sistema.



Login

![screencapture-localhost-8086-login-2023-05-19-18_07_09](https://github.com/RafaelDruz/User-authentication-system/assets/95383236/d52f97ec-6f47-425c-92ea-9b53fa999d04)



Route with authentication

![screencapture-localhost-8086-users-2023-05-19-18_07_37](https://github.com/RafaelDruz/User-authentication-system/assets/95383236/b5d768c6-cd3c-4b07-9bc0-a57a2518ebda)



Create new password

![screencapture-localhost-8086-resetpassword-2023-05-19-18_12_56](https://github.com/RafaelDruz/User-authentication-system/assets/95383236/56e4424e-3eaf-4032-b16b-ef86a15d366a)



Authentication flow

https://github.com/RafaelDruz/User-authentication-system/assets/95383236/5614bd10-01a5-4c84-81b3-d5b540398d7f

