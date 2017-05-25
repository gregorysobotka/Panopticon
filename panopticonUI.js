var app = new (require('express'))();
var wt = require('webtask-tools');

// URL for POST request to add watcher
const WebTasksAddUrl = "https://wt-8884dbb441ff761156b684c225f8889c-0.run.webtask.io/panopticonAddWatcher";

// URL for GET request to check all watchers
const WebTasksStatusUrl = "https://wt-8884dbb441ff761156b684c225f8889c-0.run.webtask.io/panopticonStatus";

/*
    NOTE: UI is for demo purposes only. Do not build UI's like this.
*/

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.end(bodyHtml());
});

function bodyHtml(){
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
                <meta charset="utf-8">
                <title>Panopticon - The all seeing eye of the web</title>
                <style> 
                    .SUCCESS{background-color:#dff0d8;}
                    .FAILURE{background-color:#f2dede;}
                    .form-control-custom {margin-bottom: 1em;}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="col-md-10">
                        <h2>Panopticon</h2>
                        <h4>The all seeing eye of the web</h4>
                        <p>Need to keep an eye on the status of a website or service? Enter the URL and the expected HTTP response codes for that url. Want to keep an eye on everything yourself? simply make a GET request to <a href="${WebTasksStatusUrl}" target="_blank">this url</a>.</p>
                        <form id="addWatcher">
                            <label>URL to watch</label>
                            <input type="url" id="url" class="form-control form-control-custom" placeholder="URL"/>
                            <label>Acceptable StatusCodes</label>
                            <input type="text" id="statusCodes" class="form-control form-control-custom" placeholder="200,301,302"/>
                        </form>
                        <button id="submit" class="btn btn-success form-control form-control-custom">Submit</button>
                        <status id="services"></status>
                    </div>
                </div>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
                <script>

                    // URL for POST request to add watcher
                    var WebTasksAddUrl = "${WebTasksAddUrl}";

                    // URL for GET request to check all watchers
                    var WebTasksStatusUrl = "${WebTasksStatusUrl}";

                    $(document).ready(function(){

                        $.get(WebTasksStatusUrl, function(res){
                            $('#services').html("<table class='table'>"+
                                res.status.map((service)=> 
                                    "<tr class='"+service.status+"'><td>"+service.status+"</td> <td>"+service.url+"</td><td>"+service.statusCode+"</td><td>"+service.expected.toString()+"</td></tr>"
                                )
                                .reduce((a,b)=>a+b,'<tr><th>Status</th><th>Url</th><th>Status code</th><th>Acceptable statusCodes</th></tr>'))+"</table>";
                        });

                        $('#submit').click(function(){

                            var statusCodes = $('#statusCodes')
                                                .val()
                                                .replace(/\s/g,'') // remove all whitespace
                                                .split(",") // seperate string values by comma and convert to array  
                                                .filter((val)=>Number.isInteger(parseInt(val))); // iterate over array values and only allow for numbers that can be converted to int

                            var url = $('#url').val();
                            
                            if(statusCodes.length === 0 || url.indexOf('http') === -1) return;
                            
                            $.ajax({
                                url: WebTasksAddUrl,
                                method:"POST",
                                data: JSON.stringify({
                                    url: url,
                                    statusCodes: statusCodes
                                }),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json"
                            }).done(function() {
                                location.reload();
                                // ... status update of some kind
                            });

                        });              

                    });

                </script>
            </body>
        </html>
    `;
}

module.exports = wt.fromExpress(app);