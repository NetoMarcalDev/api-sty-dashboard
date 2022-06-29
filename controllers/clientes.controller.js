const mysql  = require('../config/painel/database/mysql').pool;

exports.postClients = (req, res, next) => {

    mysql.getConnection((error, conn) => {
       
        if(error) { return res.status(500).send({ error_aqui_1: error }) }
        conn.query('SELECT * FROM client WHERE description = ? or document = ?', [req.body.description, req.body.document], (error, result) => {
            if(error) { return res.status(500).send({ error_aqui_2: error }) }
            if(result.length > 0) {
                res.status(409).send({ 
                    "statusCode": 409,
                    "error": "Conflito",
                    "message": "Cliente de Descrição ou Documento já cadastrado.",
                })
            } else {
                conn.query(
                    `INSERT INTO client(
                        name_application_bb, 
                        id_application_bb,
                        developer_application_key,
                        client_id,
                        client_secret,
                        document_type,
                        document,
                        description,
                        date,
                        address,
                        city,
                        uf,
                        cep,
                        access_key
                    ) 
                    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,? );`,
                    [
                        req.body.name_application_bb,
                        req.body.id_application_bb,
                        req.body.developer_application_key,
                        req.body.client_id,
                        req.body.client_secret,
                        req.body.document_type,
                        req.body.document,
                        req.body.description,
                        req.body.date,
                        req.body.address,
                        req.body.city,
                        req.body.uf,
                        req.body.cep,
                        req.body.access_key
                    ],
                    (error, result, fields) => {
                        conn.release();
                        if(error){ return res.status(500).send({ error_aqui_3: error }) } 
                        
                        const response = {
                            message: 'Cliente cadastrado com sucesso!',
                             clienteCadastrado: {
                                 id_client: result.insertId,
                                 description: req.body.description,
                                 request: {
                                    type: 'POST',
                                    description: 'Insere um Cliente.',
                                    url: 'https://localhost:3001/api/painel/client/create ' //Deverá ser substituido por uma variável de ambiente.
                                }
                             }
                        }
                        return res.status(201).send(response);
                })
            }
        })
    });  
}

exports.getClients =  (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM client', (error, result, fields ) => {
            conn.release();
            const response = {
                quantidade: result.length,
                clients : result.map(client => {
                    return {
                        id_client: client.id,
                        document_type: client.document_type,
                        document: client.document,
                        description: client.description,
                        date: client.date,
                        address: client.address,
                        city: client.city,
                        uf: client.uf,
                        cep: client.cep,
                        request: {
                            type: 'GET',
                            description: 'Retorna todos os Clientes cadastrados.',
                            url: 'https://localhost:3001/api/painel/clients/' //Deverá ser substituido por uma variável de ambiente.
                        }
                    }
                })
            }
            return res.status(201).send(response);
        })
    })

}

exports.getClient = (req, res, next) => {
   
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error })}
        conn.query(
            'SELECT * FROM client WHERE id = ?;',
            [req.params.id_client],
            (error, result, fields) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error })}
                
                if (result.length == 0) {
                     return res.status(404).send({
                        message: 'Clientede Id informado não existe.'
                     })
                }
                const response = {
                    client: {                        
                        id_client: result[0].id,
                        document_type: result[0].document_type,
                        document: result[0].document,
                        description: result[0].description,
                        date: result[0].date,
                        address: result[0].address,
                        city: result[0].city,
                        uf: result[0].uf,
                        cep: result[0].cep,                  
                        request: {
                            type: 'GET',
                            description: 'Retorna todos os clientes.',
                            url: 'https://localhost:3001/api/painel/clients/' //Deverá ser substituido por uma variável de ambiente.
                        }                        
                    }
                }
                return res.status(200).send(response);
            }
        ) 
    });
}