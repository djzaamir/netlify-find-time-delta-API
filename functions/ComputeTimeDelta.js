exports.handler = function (event, context, callback) {

    if (event.httpMethod != "GET") {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({ message: "POST Method not supported, please use GET instead with proper start_date_str and end_date_str query parameters" })
        });
    }


    /*
    
    
    
        BE CAREFUL BEFORE PARSING DATES AND COMPUTING TIME DELTAS
        AS JAVASCRIPT CONSIDERS 0 AS JANUARY AND SO ON

        THEREFORE IN ORDER TO ADDRESS THIS WEIRED JAVASCRIPT NAUNCE 

        I WILL BE SUBTRACTING -1 FROM THE USER SUPPLIED MONTH
    
    
    
    
    
    */

    // Months to be subtracted _ because of Javascript Weried Month indexing
    let MTBS_BOFJSWMI = 1;
    
    let { start_date_str } = event.queryStringParameters;
    let { end_date_str } = event.queryStringParameters;

    //Converting user-aquired date into Javascript Date object for computing Time Delta
    //Also cast strings to integers
    let start_date_components = start_date_str
                                            .split('-')
                                            .map(date_component => parseInt(date_component));
                                            
    
    let end_date_components = end_date_str
                                         .split('-')
                                         .map(date_component => parseInt(date_component));


    //Parse to date objects, in order to easily compute time delta 
    let start_date = new Date(start_date_components[2], start_date_components[1] - MTBS_BOFJSWMI ,start_date_components[0]);
    let end_date = new Date(end_date_components[2], end_date_components[1] - MTBS_BOFJSWMI ,end_date_components[0]);

    
    //Compute time delta in Milliseconds
    let timeDeltaInMS = end_date.getTime() - start_date.getTime();


    //Now computing number of years, months and days
    let secondsInADay = 60 * 60 * 24;

    let totalDays = (timeDeltaInMS / 1000) / secondsInADay;

    let years = parseInt(totalDays / 365);


    // A word of caution, we are dividing with 30, while a month may contain 29 or 31 days depending on month
    let months = parseInt((totalDays - (years * 365)) / 30);
    
    
    let days = totalDays - (years * 365) - (months * 30);



    const err = null;
    callback(err, {
        statusCode: 200,
        body: JSON.stringify({
            years: String(years),
            months: String(months),
            days: String(days)
        })
    });
}