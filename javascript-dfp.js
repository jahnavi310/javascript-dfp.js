/**
 *  GPT ad tag generator
 *  Author: Jahnavi Patel
 *  This file creates consistent
 *  ad logic to convert the 
 *  generated DFP ad tags 
*   to GPT ad tags.
 */
     
(function (window, undefined) {

    var debugEnabled = '';
    var adUnitPath = '';
    var adSlot = '';
    var targetParamsObj = '', targetParamsStr = '', targetParams = '', targetSlot = '';
    
    
    /**
    * Add function to the jQuery
    */
    $.adTagInit = $.fn.adTagInit  = {

        setNetwork: function (networkCode, unitName) {
            adUnitPath = '/' + networkCode + '/' + unitName;
        },

        additionalDebug: function(){
            if(localStorage.getItem('debug') === null){
                localStorage.setItem('debug','false');
            }           
            debugEnabled = localStorage.getItem('debug');
        },

        setTargettingAttributes: function(customTargettingAttributes){
            /**
            *   Convert targeting values to a array of : pair so we can 
            *   feed them into setTargeting for the slot later
            */           

            if(customTargettingAttributes !== undefined){
                targetParamsObj = customTargettingAttributes;
                if(typeof customTargettingAttributes === 'object'){
                    targetParamsStr = JSON.stringify(targetParamsObj);
                }
                else {
                    targetParamsStr = targetParamsObj;
                }
                targetParamsStr = targetParamsStr.replace('{','');
                targetParamsStr = targetParamsStr.replace('}','');
                targetParams = targetParamsStr.split(',');
            }
        
        },

        createAdSlot: function(adSize, divId){
            googletag.cmd.push(function() {
                adSlot = googletag.defineSlot(adUnitPath, adSize, divId);
                adSlot.addService(googletag.pubads());
             });  
        },

        setCustomTargetting: function(customTargettingAttributes){
            if(customTargettingAttributes !== undefined){
                for (var i = 0, len = targetParams.length; i < len; i++) {
                    var split = [];
                    split = targetParams[i].split(':');
                    var key = split[0];
                    var value = split[1];
                    key = key.replace('"', '');
                    value = value.replace('"', '');
                    key = key.slice(0, key.length - 1);
                    value = value.slice(0, value.length - 1);

                    adSlot.setTargeting(key, value);

                    if (debugEnabled == 'true') {
                        console.log('Supplying custom Targetting Attributes values to adSlot - ' + key + ',' + value);
                    }
                }
            }
        },

        pushAdSlotDiv: function(divId){
            googletag.cmd.push(function() {
                //enable syncrendering and SRA for better performance, please comment out if using async ads.
                googletag.pubads().enableSyncRendering();
                googletag.pubads().enableSingleRequest();

                googletag.enableServices();
                googletag.display(divId);   

                targetSlot = adSlot;

                //additional debugging to see if creative rendered callback
                if (debugEnabled == 'true') {
                    googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                        if(event.slot == targetSlot){
                            console.log('################  GOOGLETAG: Creative rendered callback STARTS################');
                            console.log(event);
                            console.log('divId: ' + divId + ' Creative with id: ' + event.creativeId +
                                ' is rendered to slot of size: ' + event.size[0] + 'x' + event.size[1]);
                            console.log('################  GOOGLETAG: Creative rendered callback ENDS################');
                        }
                    }); 
                }
            }); 
        },

        makeIframeVisible: function(divId){
            //special code around iframe to make it visible  
            googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                if(divId === 'YOUR_DIV' && event.isEmpty === false){
                    window.onload = function () { 
                         var iframe = $('YOUR_DIV').find('iframe');
                        iframe.height(YOUR_HEIGHT);
                        iframe.width(YOUR_WIDTH);
                    };
                }
            });                    
        },

        setAndDisplayAdSlot: function (networkCode, unitName, adSize, divId, customTargettingAttributes) {
            this.setNetwork(networkCode, unitName);
            this.additionalDebug();
            this.setTargettingAttributes(customTargettingAttributes);
            if (debugEnabled == 'true') {
                console.log('----------------------------------------------------------------------');
                console.log('Setting SLOT with options -- networkCode: ' + networkCode + 
                    ' -- adSize:' + adSize + ' -- divId:' + divId);
                console.log('----------------------------------------------------------------------');
            }
            this.createAdSlot(adSize, divId);
            this.setCustomTargetting(customTargettingAttributes);
            this.pushAdSlotDiv(divId);
            
            //uncomment the below function only if iframe is invisible due to some unforseen reason
            //this.makeIframeVisible(divId)
        }
    };
})(window);

