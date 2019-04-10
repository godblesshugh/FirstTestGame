'use strict';

var common = require('./common');

//敌机组
var enemyG = cc.Class({
    name: 'enemyG',
    properties: {
        name: '',
        freqTime: 0,
        initPoolCount: 0,
        prefab: cc.Prefab,
        position: new cc.v2(0, 0),
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        enemyG: {
            default: [],
            type: enemyG,
        }
    },

    onLoad: function () {
        this.eState = common.GameState.none;
        common.BatchInitObjPool(this, this.enemyG);
    },

    startAction: function () {
        this.eState = common.GameState.start;
        for (var i = 0; i < this.enemyG.length; i++) {
            var freqTime = this.enemyG[i].freqTime;
            var enemyName = 'enemy_callback_' + i;
            this[enemyName] = function (i) {
                this.getNewEnemy(this.enemyG[i]);
            }.bind(this, i);
            this.schedule(this[enemyName], freqTime);
        }
    },
    getNewEnemy: function (enemyInfo) {
        var objName = enemyInfo.name;
        if (Global.existEnemy > 5) {
            return;
        }
        var newNode = common.PopPool(this, objName, enemyInfo.prefab, this.node);
        newNode.getComponent('enemy').init();
    },
    getNewEnemyPosition: function (newNode) {
        var randx = Math.random() > 0.5 ? this.node.parent.width / 2 - newNode.width / 2 - 10 : -this.node.parent.width / 2 + newNode.width / 2 + 10;
        var randy = this.node.parent.height / 2 - newNode.height / 2;
        return cc.v2(randx, randy);
    },
    enemyDestroy: function (nodeInfo) {
        common.PushPool(this, nodeInfo);
    },
});