mathEditor
==========
[![Build Status](https://travis-ci.org/zizibujuan/mathEditor.png?branch=master)](https://travis-ci.org/zizibujuan/mathEditor)

visual math editor

## 特点

1. 支持纯键盘快速输入；
* 数学符号，会读就会写；
* 输入符号名称的汉语拼音首字母，会弹出提示框，然后选择数学符号
* 可定制的快捷键

默认快捷键列表：

1. 中文版

切换到编辑数学公式模式 `Ctrl` + `=`

退出编辑数学公式模式 `Ctrl` + `=`

除号 `/`

乘号 `*`

根号 `gh`

分数 `fs`

右上坐标 `^`

右下坐标 `_`

## 演示页面
http://localhost:port/mathEditor/tests/demo/Editor.html

## 配置开发环境

该项目是eclipse plugin项目，需要专门创建一个plugin项目存储启动脚本。


## 测试

mathEditor使用[Intern](http://theintern.io/)做单元测试和功能测试。

浏览器中的页面

http://localhost:port/mathEditor/tests/runTests.html

