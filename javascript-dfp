/**
 *  GPT ad tag generator
 *  Author: Jahnavi Patel
 *  This file creates consistent
 *  ad logic to convert the 
 *  generated DFP ad tags 
*   to GPT ad tags.
 */

window.gptAdTag = {

    insertTag: function () {      

        var googletag = googletag || {};
        googletag.cmd = googletag.cmd || [];

        (function() {
            var gads = document.createElement('script');
            gads.async = true;
            gads.type = 'text/javascript';
            var useSSL = 'https:' == document.location.protocol;
            gads.src = (useSSL ? 'https:' : 'http:') +
              '//www.googletagservices.com/tag/js/gpt.js';
            var node = document.getElementsByTagName('script')[0];
            node.parentNode.insertBefore(gads, node);
        })();
    },
    
    setAdSlot: function (networkCode, unitName, adSize, divId, customTargettingAttributes) {

        var debugEnabled;
        var adUnitPath = '';
        var adSlot;
        
        if(!window.googletag){
            this.insertTag();
        }

        adUnitPath = '/' + networkCode + '/' + unitName;

        var raw = [];
    
        var adTargeting, adTargetingString;

        if(localStorage.getItem('debug') == null){
            localStorage.setItem('debug','false');
        }
       
        debugEnabled = localStorage.getItem('debug');
        /**
        *   Convert targeting values to a array of : pairs so we can 
        *   feed them into setTargeting for the slot later
        */           

        if(customTargettingAttributes != null){
            adTargeting = customTargettingAttributes;
            adTargetingString = JSON.stringify(adTargeting);
            adTargetingString = adTargetingString.replace('{','');
            adTargetingString = adTargetingString.replace('}','');
            rawTargetingArray = adTargetingString.split(',');
        }
    
        if (debugEnabled == 'true') {
            console.log('----------------------------------------------------------------------');
            console.log('setting Slot with options -- networkCode: ' + networkCode + 
                ' -- adSize:' + adSize + ' -- divId:' + divId + ' -- detail:' + detail
                + ' -- pos:' + pos + ' -- ordmod:' + ordmod);
            console.log('----------------------------------------------------------------------');
        }

        googletag.cmd.push(function() {
            adSlot = googletag.defineSlot(adUnitPath, adSize, divId);
            adSlot.addService(googletag.pubads());
            
            if(customTargettingAttributes != null){
                for (var i = 0, len = rawTargetingArray.length; i < len; i++) {
                    var split = [];
                    split = rawTargetingArray[i].split(':');
                    var key = split[0];
                    var value = split[1];

                    key = key.replace('"', '');
                    value = value.replace('"', '');
                    key = key.slice(0, key.length - 1);
                    value = value.slice(0, value.length - 1);

                    adSlot.setTargeting(key, value);

                    if (debugEnabled == 'true') {
                        console.log('Supplying customTargettingAttributes values to adSlot - ' + key + ',' + value);
                    }
                }
            }
            
            //enable syncrendering and SRA for better performance.
            googletag.pubads().enableSyncRendering();
            googletag.pubads().enableSingleRequest();

            googletag.enableServices();
            googletag.display(divId);   

            var targetSlot = adSlot;

            //additional debugging to see if creative rendered callback
            if (debugEnabled == 'true') {
                googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                    if(event.slot == targetSlot){
                        console.log('################  GOOGLETAG: Creative rendered callback');
                        console.log(event);
                        console.log('divId: ' + divId + ' Creative with id: ' + event.creativeId +
                            ' is rendered to slot of size: ' + event.size[0] + 'x' + event.size[1]);
                    }
                }); 
            }

            //special code around iframe to make it visible  
             /*googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                if(divId == 'YOUR_DIV' && event.isEmpty == false){
                    window.onload = function () { 
                        var iframe = $('YOUR_DIV').find('iframe');
                        iframe.height(YOUR_HEIGHT);
                        iframe.width(YOUR_WIDTH);
                    }
                }
            });*/ 
        });        
    }
};

