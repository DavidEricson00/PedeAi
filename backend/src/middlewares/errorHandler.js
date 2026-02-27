export function errorHandler(err, req, res, next) {
    console.error(err);

    return res.status(err.statusCode || 300).json({
        error: err.message || "Erro interno do servidor"
    });
}