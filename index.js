const express = require('express');
const fs = require('fs');
const app = express();

app.get('/carrera', (req, res) => {
    const numCorr = parseInt(req.query.numCorr, 10);
    const distancia = parseFloat(req.query.distancia);

    let corredores = [];

    for (let i = 0; i < numCorr; i++) {
        const velocidad = Math.random() * (20 - 5) + 5;
        corredores.push({
            id: i + 1,
            velocidad: velocidad.toFixed(2), // Se supone que toFixed redondea los numeros
            distanciaRecorrida: 0
        });
    }

    let horas = 0;
    const progresoPorHora = [];

    while (true) {
        horas++;

        const progresoHoraActual = [];

        for (let i = 0; i < corredores.length; i++) {
            corredores[i].distanciaRecorrida += parseFloat(corredores[i].velocidad);
            progresoHoraActual.push({
                corredorId: corredores[i].id,
                distanciaRecorrida: corredores[i].distanciaRecorrida.toFixed(2) 
            });
        }

        progresoPorHora.push({
            hora: horas,
            progreso: progresoHoraActual
        });

        let carreraTerminada = true;
        for (let i = 0; i < corredores.length; i++) {
            if (corredores[i].distanciaRecorrida < distancia) {
                carreraTerminada = false;
                break;
            }
        }

        if (carreraTerminada) {
            break;
        }
    }

    const resultadoCarrera = corredores.map(corredor => ({
        id: corredor.id,
        velocidad: corredor.velocidad,
        distanciaRecorrida: corredor.distanciaRecorrida,
        horas: horas
    }));

    fs.writeFileSync('carrera.json', JSON.stringify(progresoPorHora, null, 2));

    res.json({
        horas,
        progresoPorHora
    });
});

app.listen(3000, () => {
    console.log("Servidor Corriending...");
});

