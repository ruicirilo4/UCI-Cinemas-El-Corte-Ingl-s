const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  // URL da página web que deseja raspar
  const url = 'https://filmspot.pt/cinema/uci-cinemas-el-corte-ingles-lisboa-61/';

  axios.get(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);

      // Seletor CSS para encontrar as imagens
      const imageSelector = '.cinemaFilmePoster';
      const images = [];

      $(imageSelector).each((index, element) => {
        const imageUrl = $(element).attr('src');
        images.push(imageUrl);
      });

      // Seletor CSS para encontrar as salas
      const salaSelector = '.sala';
      const salas = [];

      $(salaSelector).each((index, element) => {
        const salaNumero = $(element).text();
        salas.push(salaNumero);
      });

      // Criar uma página HTML com as imagens e salas correspondentes
      let htmlResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lista de Filmes e Salas</title>

          
          <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
          }
        
          h1 {
            text-align: center;
            color: #333;
          }
        
          ul {
            list-style-type: none;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }
        
          li {
            margin: 20px;
            text-align: center;
          }
        
          img {
            max-width: 100%;
            height: auto;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        
          p {
            margin-top: 10px;
            font-weight: bold;
          }
        </style>
        
          </style>
        </head>
        <body>
          <h1>UCI Cinemas El Corte Inglés - Lisboa</h1>
          <ul>`;

      images.forEach((imageUrl, index) => {
        htmlResponse += `
          <li>
            <img src="${imageUrl}" alt="Filme ${index + 1}" />
            <p>${salas[index]}</p>
          </li>
        `;
      });

      htmlResponse += `
          </ul>
        </body>
        </html>`;

      res.send(htmlResponse);
    })
    .catch(error => {
      console.error('Erro ao acessar a página:', error);
      res.status(500).send('Erro interno do servidor');
    });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
