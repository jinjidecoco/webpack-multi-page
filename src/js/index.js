require('../css/lib/reset.less');
require('../css/common/common.less');
require('../css/index.less');
require('./lib/jstree/themes/default/style.less')
// <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/jstree/3.3.3/themes/default/style.min.css" />
require('./lib/jstree/jstree.js')
// <script src="//cdnjs.cloudflare.com/ajax/libs/jstree/3.3.3/jstree.min.js"></script>

// $('.box').html('我的值是通过js获取的');
$('#container').jstree({
  "core" : {
    "check_callback" : true, // enable all modifications
  },
  "plugins" : ["dnd","contextmenu"]
});