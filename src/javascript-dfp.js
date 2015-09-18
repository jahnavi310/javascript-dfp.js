/**
 *  GPT ad tag generator
 *  Author: Jahnavi Patel
 *  This file creates consistent
 *  ad logic to convert the 
 *  generated DFP ad tags 
*   to GPT ad tags.
 */
     
(function (window, undefined) {
    "use strict";

    var debugEnabled = '', adUnitPath = '', adSlot = '';
    var enableSRA = false, enableSyncRendering = false;
    var targetParamsObj = '', targetParamsStr = '', targetParams = '', targetSlot = '';
    var allSlots = [];

    
    /**
    * Add function to the jQuery
    */
    $.adTagInit = $.fn.adTagInit  = {

        setNetwork: function (networkCode, unitName) {
            adUnitPath = '/' + networkCode + '/' + unitName;
        },

        /** 
        *   This function sets up additional debug in addition to the google console.
        *   Change the value of debug to true to turn debugging on.
        **/
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

        /**
        *   Create the ad slot
        **/
        createAdSlot: function(adSize, divId){
            googletag.cmd.push(function() {
                adSlot = googletag.defineSlot(adUnitPath, adSize, divId);
                adSlot.addService(googletag.pubads());
                allSlots.push(adSlot);
             }); 
        },

        /**
        *   Set custom targetting for all the ad slots
        **/
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

                //change the value to true to turn on SRA and syncr-endering.
                if(enableSyncRendering){
                    googletag.pubads().enableSyncRendering();
                }
                
                if(enableSRA){
                    googletag.pubads().enableSingleRequest();
                }
                
                googletag.enableServices();
                googletag.display(divId);   

                targetSlot = adSlot;

                //additional debugging to see if creative rendered callback
                if (debugEnabled == 'true') {
                    googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                        if(event.slot == targetSlot){
                            console.log('################  GOOGLETAG: Creative rendered callback STARTS################');
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

        /**
        *   Refresh all the slots
        **/
        refreshAllSlots: function(){
            console.log("Ad Slots are REFRESHED.....");
            googletag.cmd.push(function() {
                $.each( allSlots, function( index, value ){
                    googletag.pubads().refresh([allSlots][index]);
                });
            });
        
        },

        /**
        *   Clear out all the slots
        **/
        clearAllSlots: function() {
            console.log('Ad Slots are CLEARED.....');
            googletag.cmd.push(function() {
                googletag.pubads().clear();
            });
         },

        defineAdSlot: function (networkCode, unitName, adSize, divId, customTargettingAttributes) {
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

