function modalService($modal, sweetAlert){
        return {
        	confirm : function(options, callback){
        		var _default = {
	        	   confirmButtonColor: "#DD6B55", 
	               confirmButtonText: "Si",
	               cancelButtonText: "No",
	               showCancelButton: true,
	               closeOnConfirm: false,
	               closeOnCancel: true 
        		}

                window.sweet = sweetAlert.swal(angular.extend(_default, options), callback);
        	},

        	removeConfirm : function(options, callback){
        		var _default = {
        		   title: "Está Seguro?",
                   text: "Una vez eliminado este registro, no podrá volver a usarlo.",
                   type: "warning",
	        	   confirmButtonColor: "#DD6B55", 
	               confirmButtonText: "Eliminar",
	               cancelButtonText: "Cancelar",
	               showCancelButton: true,
	               closeOnConfirm: false,
	               closeOnCancel: true 
        		}

                window.sweet = sweetAlert.swal(angular.extend(_default, options), callback);
        	},

        	incompleteForm : function(callback){
        		   var options = {
                        confirmButtonText: "Ok",
                        showCancelButton: false,
                        title: "Formulario no completado",
                        text: "Los campos con (*) son obligatorios",
                        type: "error"
                    };

                window.sweet = sweetAlert.swal(options, callback);
        	}

        }
   }
angular.module('starter.services')
  .service('modal', modalService)
  ;