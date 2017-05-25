# Panopticon

Panopticon is a simple service that accepts a url and an array of status codes. A endpoint is provided that gives the status for every url being tracked and whether or not the current response statusCode matches one of the expected statusCodes.

## Steps : 

- go to http://docs.mlab.com/ and create a free sandbox database AND a user 

- install webtask CLI ( https://webtask.io/cli )

- Deploy web tasks

```
wt create panopticonAddWatcher.js --secret MLabUrl=mongodb://user:password@MLabUrl
wt create panopticonStatus.js --secret MLabUrl=mongodb://user:password@MLabUrl
wt create panopticonUI.js
```

- Navigate to the url that was returned after creating panopticonUI

## API

POST : {panopticonAddWatcherUrl}

    url : string
    statusCodes: [ints]

    Body: {
        url: "https://google.com/s=",
        statusCodes:[200,300] 
    }

    Response: {
        added: {
            url:"urlAdded",
            statusCodes:['status','codes','added']
        }
    }

GET : {panopticonStatusUrl}

    Response : {
        "status": [
            {
                "status": "FAILURE",
                "url": "https://google.com/s=",
                "statusCode": 404,
                "expected": [200,300]
            }
        ]
    }

## Possible features

- delete functionality (remove watcher)
- add logic around data verification (useful for REST API's)
    : Expect certain fields to be present and have a type of value (string, int, etc.) OR exact matches
- add ability to trigger other HTTP Request Methods (put, delete, post)
- schedule cron to check services (all urls or on a per url basis)
- logic for handling failures
    : callback url 
    : publish message to third party service
    : allow for status update email (for verified email accounts) on failure

## Enhancements

- migrate panopticonAddWatcher and panopticonStatus to single worker    