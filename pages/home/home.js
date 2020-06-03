// pages/home/home.js
import {
  getMultidata,
  getGoodsdata
}from "../../service/home.js"

const BACKTOPDIS=1000;

const types=['pop','new','sell']

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:'',
    recommends:'',
    titles:['流行','精选','新款'],
    goods:{
      pop:{page:0,list:[]},
      new:{page:0,list:[]},
      sell:{page:0,list:[]}
    },
    currentType:'pop',
    isFiexd: false,
    tabScrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getMultidata().then(res => {
      const banners = res.data.data.banner.list;
      const recommends = res.data.data.recommend.list;
      
      this.setData({
        banners: banners,
        recommends:recommends
      })
    });
    this._getGoodsdata('pop'),
    this._getGoodsdata('new'),
    this._getGoodsdata('sell')
  },
   //-------------网络请求-----------------------
   _getGoodsdata(type){
     //获取页码
     const page = this.data.goods[type].page + 1;
     getGoodsdata(type, page).then(res=>{
      //2.1取出返回的数据
      const list=res.data.data.list;
       //2.2将数据设置到对应的type的list中
       const oldlist=this.data.goods[type].list;
       //使用es6的语法
       oldlist.push(...list);

       //2.3将数据设置到data的goods中
      //获取good中的list
      const typeKey = `goods.${type}.list`;
      //获取goods中的page
      const pageKey = `goods.${type}.page`;
      this.setData({
        [typeKey]:oldlist,
        [pageKey]:page
      })
    })
  },
  //-------------事件处理------------------------
  //tab事件处理
  tabclick(event){
    //取出index
    const index= event.detail.index;
    //设置currentType
    this.setData({
      currentType:types[index]
    })
    
  },

  //监听推荐的图片加载完成
  loadover(){
    //获取某个控件距离顶部的高度
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect =>{
      this.data.tabScrollTop=rect.top;
    }).exec();
  },

  onReachBottom() {
    //上拉加载更多 -> 请求数据
    this._getGoodsdata(this.data.currentType)
  },

  onPageScroll: function(options){
    const scrollTop = options.scrollTop;
    //回到顶部
    const flag=scrollTop >=BACKTOPDIS
    //官方提示，不建议在onPageScroll 频繁的调用this.setData方法
    //因为会不断的刷新界面
    if(flag!=this.data.showBacktop){
      this.setData({
        showBacktop:flag
      })
    
       //tabcontrol停留效果
    const flag2 = scrollTop >= this.data.tabScrollTop;
    if(flag2 != this.data.isFiexd){
      this.setData({
        isFiexd:flag2
      })
    }
    }
  }
})