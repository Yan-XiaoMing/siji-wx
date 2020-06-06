module.exports = {
    "button":[
      {
        "type":"view",
        "name":"进入页面",
        "url":"http://47.96.167.250"
      },
      {
        "name":"二级菜单",
        "sub_button":[
          {
            "type": "scancode_waitmsg",
            "name": "扫码带提示",
            "key": "扫码带提示"
          },
          {
            "type": "scancode_push",
            "name": "扫码推事件",
            "key": "扫码推事件"
          },
          {
            "type": "pic_sysphoto",
            "name": "系统拍照发图",
            "key": "系统拍照发图"
          },
          {
            "type": "pic_photo_or_album",
            "name": "拍照或者相册发图",
            "key": "拍照或者相册发图"
          }
        ]
      },
      {
        "name":"三级菜单",
        "sub_button":[
          {
            "type": "pic_weixin",
            "name": "微信相册发图",
            "key": "微信相册发图"
          },
          {
            "type": "location_select",
            "name": "发送位置",
            "key": "发送位置"
          }
          
        ]
      }
    ]
  }