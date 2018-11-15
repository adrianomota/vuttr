/**
 * Handler para uso em .catch() de promises
 * Define o status de erro no Http response (res)
 * e define o corpo da mensagem com o nome e a mensagem
 * de erro (se disponíveis)
 */
module.exports.handleError = (res) => (err, code) => {
    console.error(err.name || err.message);
    const codeError = (err.code) ? err.code : code;
    return res.status(codeError).json({
        error: err.name,
        message: err.message
    });
};