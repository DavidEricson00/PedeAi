import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pede Aí API",
      version: "1.0.0",
      description: "Documentação da Pede Aí, uma API focada na automatização de um sistema de pedidos",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: [
    "./src/routes/*.js",
    "./src/docs/*.js"
    ], 
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;