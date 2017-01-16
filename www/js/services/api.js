'use strict';

/**
 * @ngdoc service
 * @name shoplyApp.api
 * @description
 * # api
 * Service in the shoplyApp.
 */
angular.module('starter.controllers')
  .service('api', function ($http, constants) {
    this.get = function(){ var url = this.url; this.reset(); return $http.get(url); };
    this.post = function(data, header){  var url = this.url; this.reset(); return $http.post(url, data || {}, header || { headers : {'Content-Type': 'application/json'} }); };
    this.put = function(data){ var url = this.url; this.reset(); return $http.put(url, data || {}); } ;  
    this.delete = function(){ var url = this.url; this.reset(); return $http.delete(url); };
    
    this.Headers = null;

    this.add = function(comp){ this.url += comp; return this;  };
    this.headers = function(headers){ this.Headers = headers; return this;  };
    this.reset = function(){ this.url = ""; };

    this.user = function(user){if(user) this.url = constants.base_url + "user/" + user; else this.url = constants.base_url + "user/"; return this;};
    this.pedido = function(pedido){if(pedido) this.url = constants.base_url + "pedido/" + pedido; else this.url = constants.base_url + "pedido/"; return this;};
    this.categoria = function(categoria){if(categoria) this.url = constants.base_url + "categoria/" + categoria; else this.url = constants.base_url + "categoria/"; return this;};
     this.arqueos = function(arqueo){if(arqueo) this.url = constants.base_url + "arqueos/" + arqueo; else this.url = constants.base_url + "arqueos/"; return this;};
    this.formas_pagos = function(formaPago){if(formaPago) this.url = constants.base_url + "formasPago/" + formaPago; else this.url = constants.base_url + "formasPago/"; return this;};
    this.facturacion = function(factura){if(factura) this.url = constants.base_url + "facturacion/" + factura; else this.url = constants.base_url + "facturacion/"; return this;};
    this.ivas = function(iva){if(iva) this.url = constants.base_url + "ivas/" + iva; else this.url = constants.base_url + "ivas/"; return this;};
    this.producto = function(producto){if(producto) this.url = constants.base_url + "producto/" + producto; else this.url = constants.base_url + "producto/"; return this;};
    this.upload = function(){ this.url = constants.uploadURL; return this};
    
    return this;
  });
