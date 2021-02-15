const express = require('express');
const router = express.Router()
const contenttype = 'application/hal+json';
const ST = require('stjs');
const getStartDates = require('../modules/getStartDates');
let daten = getStartDates();




router.get('/',(req,res)=>{
    res.header("Content-Type", contenttype);

    function Inhalt(titel, link) {
        this.titel = titel;
        this.link = link;
    }
    let inhalt = [];

    inhalt.push(new Inhalt('Prognose Bundesweit', 'bundesweit'));
    inhalt.push(new Inhalt('Prognose Bundesland', 'bundesland'));
    inhalt.push(new Inhalt('Prognose Landkreis', 'landkreis'));

    const parsed = ST.select({"items": inhalt})
        .transformWith({
            "{{#each items}}": {
                "Titel": "{{this.titel}}",
                "_links": {
                    "self": {"href": "/prog/{{this.link}}"}
                }
            }
        })
        .root();
    res.send(parsed);
});

router.get('/landkreis',(req,res)=>{
    res.header("Content-Type", contenttype);
    const getLandkreise = require('../modules/getLandkreise');

    getLandkreise((array)=>{

        const parsed = ST.select({"items": array})
            .transformWith({
                "{{#each items}}": {
                    "Landkreis": "{{this.Landkreis}}", "IDLandkreis": "{{this.IdLandkreis}}",
                    "_links": {
                        "self": {"href": "/prog/landkreis/{{IdLandkreis}}"}
                    }
                }
            })
            .root();
        res.send(parsed);

    });
});


router.get('/bundesland',(req,res)=>{
    res.header("Content-Type", contenttype);
    const getBundeslaender = require('../modules/getBundeslaender');

    getBundeslaender((array)=>{

        const parsed = ST.select({"items": array})
            .transformWith({
                "{{#each items}}": {
                    "Bundesland": "{{this.Bundesland}}", "IDBundesland": "{{this.IdBundesland}}",
                    "_links": {
                        "self": {"href": "/prog/bundesland/{{IdBundesland}}"}
                    }
                }
            })
            .root();
        res.send(parsed);

    });
});

router.get('/bundesweit',(req,res)=>{
    res.header("Content-Type", contenttype);
        const parsed = ST.select({"items": daten})
            .transformWith({
                "{{#each items}}": {
                    "Startdatum": "{{this}}",
                    "_links": {
                        "self": {"href": "/prog/bundesweit/{{this}}"}
                    }
                }
            })
            .root();
        res.send(parsed);
    });

router.get('/bundesweit/:id',(req,res)=>{
    res.header("Content-Type", contenttype);
    let sended = false;
    for (let i = 0; i < daten.length; i++){
        if (req.params.id === daten[i]){
            sended=true;
            res.send("richtig");
        }
    }
    if (sended === false){
        res.status(400).send('Error 400');
    }
});


module.exports = router;