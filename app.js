//importing modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );


var app = express();
app.set( 'view engine', 'ejs' );
app.use( '/assets', express.static( 'assets' ) );


// Step 1 - Classified ad real estate definition
// Schema JSON


var info = {
    Title: "Information of the real estate",
    price: 0,
    surface: 0,
    nbr_pieces: 0,
    city: '',
    codePostal: '',
    type: "",
    prixM2: 0,
};

// Step 2 - Estimation from Meilleurs agents

function call_MeilleursAgents( receivedData ) {

    request( 'https://www.meilleursagents.com/prix-immobilier/' + data.city.toLowerCase(), function ( error, response, body ) {
        if ( response.statusCode == 200 && !error ) {
            var averagePrice = "";

            var $ = cheerio.load( body );

            let myData = {
                // average price m² for a flat in this city
                av_price_flat: $( '.small-4.medium-2.columns.prices-summary__cell--median' ).eq( 0 ).text(),
                //average price m² for a house in this city
                av_price_house: $( '.small-4.medium-2.columns.prices-summary__cell--median' ).eq( 1 ).text(),

            }
            receivedData( myData )
        }
        else {
            console.log( error )
        }
    })
}

// Step 4 - require('leboncoin')
// Create a module called leboncoin

function call_LebonCoin( receivedData ) {


    request( 'https://www.leboncoin.fr/ventes_immobilieres/1087516332.htm?ca=12_s', function ( error, response, body ) {
        if ( response.statusCode == 200 && !error ) {
            var $ = cheerio.load( body );

            const lbcDataArray = $( 'section.properties span.value' )

            let lbcData = {
                //prix 
                price: parseInt( $( lbcDataArray.get( 0 ) ).text().replace( /\s/g, '' ), 10 ),

                //Ville 
                city: $( lbcDataArray.get( 1 ) ).text().trim().toLowerCase().replace( /\s/g, '-' ),

                // Type 
                type: $( lbcDataArray.get( 2 ) ).text().trim().toLowerCase(),

                // Surface 
                surface: parseInt( $( lbcDataArray.get( 4 ) ).text().replace( /\s/g, '' ), 10 )

            }

            receivedData( lbcData )
        }
        else {
            console.log( error )
        }
    })
}



//makes the server respond to the '/' route and serving the 'home.ejs' template in the 'views' directory
app.get( '/', function ( req, res ) {

    var url = req.query.urlLBC

    call_LebonCoin( function ( data ) {
        //Display and show
        res.render( 'home', {
            message: url,
            message1: data.price,
            message2: data.city,
            message3: data.type,
            message4: data.surface,
            message5: prixM2 = data.price / data.surface,
        });
    });

})

//launch the server on the 3000 port
app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
});