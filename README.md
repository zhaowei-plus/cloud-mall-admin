# 云商城

## 项目选型

使用umijs React框架。官网地址：https://umijs.org/

## 运行

```
npm run start
```

## 打包

不同的省份，打包命令不一样

```
npm run build:zj // 浙江
npm run build:cq // 重庆
npm run build:gx // 广西
npm run build:hn // 河南
```

## 发布

新的发布走 Jenkins 打包，地址：http://10.0.10.207:8080/
线上走发布系统：https://deploy.uban360.com/#/

## 测试

-   describe 表示测试集合
-   it/test 测试用例
-   expect/assert 断言比较，检测是否达到预期

## 单元测试

-   %Stmts 是语句覆盖率（statement coverage）：是不是每个语句都执行了？
-   %Branch 分支覆盖率（branch coverage）：是不是每个if代码块都执行了？
-   %Funcs 函数覆盖率（function coverage）：是不是每个函数都调用了？
-   %Lines 行覆盖率（line coverage）：是不是每一行都执行了？

%Stmts 和 %Lines 的区别是：行覆盖率的颗粒度是大于语句覆盖率的，因为可能允许一行中有多条语句（js开发中尤为常见）。

## 参考文章

[使用Jest进行React单元测试](https://juejin.im/post/5b6c39bde51d45195c079d62)

[单元测试](https://www.yuque.com/ant-design/course/unittest)

