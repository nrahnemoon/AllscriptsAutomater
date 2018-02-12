@echo off

call authenticationInfo.cmd

cscript getOrders.js "getOrders" %username% %password%
