const mysql  = require('../config/painel/database/mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postUser = (req, res, next) => {
    //console.log(req.user)
    mysql.getConnection((error, conn) => {
       
        if(error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM user WHERE description_user = ?', [req.body.description_user], (error, result) => {
            if(error) { return res.status(500).send({ error: error }) }
            if(result.length > 0) {
                res.status(409).send({  "statusCode": 409,
                "error": "Conflito",
                "message": "Usuário já cadastrado."
            })
            } else {
                bcrypt.hash( req.body.password_user, 10, (errBcrypt, hash) => {
                    if(errBcrypt) { return res.status(500).send({ error: errBcrypt })}
                    conn.query(
                        'INSERT INTO user(description_user, password_user) VALUES(?,?);',
                        [req.body.description_user, hash],
                        (error, result, fields) => {
                            conn.release();
                            if(error){ return res.status(500).send({ testeErro: error }) } 
                            
                            const response = {
                                message: 'Usuário cadastrado com sucesso!',
                                 usuarioCadastrado: {
                                     id_user: result.insertId,
                                     descricao: req.body.description_user,
                                     request: {
                                        type: 'POST',
                                        description: 'Insere um usuário de acesso.',
                                        url: 'https://localhost:3001/api/painel/users/create ' //Deverá ser substituido por uma variável de ambiente.
                                    }
                                 }
                            }
                            return res.status(201).send(response);
                    })
                }); 
            }
        })
    });  
}
exports.getUsers =  (req, res, next) =>{
   
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error })}
        conn.query(
            'SELECT * FROM user;',
            (error, result, fields) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error })}
                const response = {
                    quantidade: result.length,
                    users: result.map(user => {
                        return {
                            id_user: user.id_user,
                            descricao: user.description_user,
                            request: {
                                type: 'GET',
                                description: 'Retorna todos os usuários cadastrados.',
                                url: 'https://localhost:3001/api/painel/users/' //Deverá ser substituido por uma variável de ambiente.
                            }
                        }
                    })
                }
                return res.status(201).send(response);
            }
        )
    });
}
exports.getUser = (req, res, next) => {
   
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error })}
        conn.query(
            'SELECT * FROM user WHERE id_user = ?;',
            [req.params.id_user],
            (error, result, fields) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error })}
                
                if (result.length == 0) {
                     return res.status(404).send({
                        message: 'Usuário de Id informado não existe.'
                     })
                }
                const response = {
                    usuario: {                        
                        id_user: result[0].id_user,
                        descricao: result[0].description_user,
                        request: {
                            type: 'GET',
                            descricao: 'Retorna todos os usuários.',
                            url: 'https://localhost:3001/api/painel/users/' //Deverá ser substituido por uma variável de ambiente.
                        }                        
                    }
                }
                return res.status(200).send(response);
            }
        ) 
    });
}
exports.patchUser = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        
        if(error) { return res.status(500).send({ error: error }) }
        
        bcrypt.hash( req.body.password_user, 10, (errBcrypt, hash) => {
            
            if(errBcrypt) { return res.status(500).send({ error: errBcrypt })}
            
            conn.query(
                `UPDATE user
                    SET 
                        description_user = ?,
                        password_user = ?
                    WHERE
                        id_user = ?;`,
                [req.body.description_user, hash,  req.body.id_user],
                (error, result, fields) => {
                    conn.release();
                    if(error) { return res.status(500).send({ error: error })}
                    
                    const response = {
                        message: 'Usuário atualizado com sucesso.',
                        usuario: {
                            id_user: req.body.id_user,
                            descricao: req.body.description_user,
                            request: {
                               type: 'GET',
                               description: 'Retorno os detalhes de um usuário específico.',
                               url: 'https://localhost:3001/api/painel/users/' + req.body.id_user //Deverá ser substituido por uma variável de ambiente.
                           }
                        }
                   }
                   return res.status(202).send(response);                             
                }
            )
        }); 
    });     
}
exports.deleteUser = (req, res, next) =>{
   
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error })}
        conn.query(
            `DELETE FROM user WHERE id_user = ?;`,
            [req.body.id_user],
            (error, result, fields) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error })}
                
                const response = {
                    message: 'Usuário excluído com sucesso.',
                    request: {
                        type: 'POST',
                        description: 'Insere um usuário.',
                        url: 'https://localhost:3001/api/painel/users/create',
                        body: {
                           description_user: 'String',
                           password_user: 'String' 
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
}
exports.loginUser =  (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error })}
        const query = 'SELECT * FROM user WHERE description_user = ?;';
        conn.query(query, [req.body.description_user], (error, results, fields) => {
            conn.release();
            if(error) { return res.status(500).send({ error: error })}
            if(results.length < 1) {
                return res.status(401).send({ message: 'Fala na autenticação' })
            } 
            bcrypt.compare(req.body.password_user,  results[0].password_user, (err, result) => {
                if(err) {
                  return res.status(401).send({ message: 'Fala na autenticação' })
                }
                if(result) {
                    const token = jwt.sign({
                      id_user: results[0].id_user,
                      description_user: results[0].description_user
                    },
                    process.env.JWT_KEY,
                    {
                      expiresIn: "1h"
                    });
                    return res.status(200).send({                         
			user: {
				id_user: results[0].id_user,
				description_user: results[0].description_user
			},
			message:  'Autenticado com sucesso.',
                        access_token: token,
                        token_type: "Bearer",
                        expires_in: 3600,
                    });
                }
                return  res.status(401).send({ message: 'Fala na autenticação' })
          });
        });
    });
}


