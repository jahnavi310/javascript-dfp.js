javascript-dfp.js

javascript-dfp -  A pure javascript implementation for Google DFP

This script enables Double Click for Publishers (DFP) by Google working on your page. Just include this script on your page, initialize as described below and you should be good to go.

Requirements

This library requires jquery and gpt.js (the latest version can be obtained from google's CDN network ) to be included in the head section of your page. 

Getting Started

Installation:

```bower install javascript-dfp --save```

Next step would be to add the js file reference:

```<script type="text/javascript" src="...YOUR PATH/javascript-dfp.js"></script>```

To show an ad on your page use the following:
```
<div id="div-gpt-test-ad" style="width:300px; height:250px;">
  <script type="text/javascript">
    var targettingAttr = {"test":"test"};
    $.adTagInit.setAdSlot('6355419','Travel/Europe/France/Paris', [300, 250], 'div-gpt-test-ad', targettingAttr);
  </script>
</div>
```

```
<div id="div-gpt-test-ad" style="width:300px; height:250px;">
  <script type="text/javascript">
    $.adTagInit.setAdSlot('6355419','Travel/Europe/France/Paris', [300, 250], 'div-gpt-test-ad', '{"test":"test"}');
  </script>
</div>
```

targettingAttr is used to set the custom targetting for individual ads. This can either be a JSON object or a string.
Use a JSON object in case you have a global object that is used across all the ads.

Issues

Any issues found herewith and suggestions for improvement are most welcome

Contributing

Pull requests and contribution are more than welcome
