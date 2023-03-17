function setCookie(key, value, expiry) {
    var expires = new Date();
    expires.setTime(expires.getTime() + expiry * 24 * 60 * 60 * 1000);
    document.cookie = key + "=" + value + ";expires=" + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
    return keyValue ? keyValue[2] : null;
}

function eraseCookie(key) {
    var keyValue = getCookie(key);
    setCookie(key, keyValue, "-1");
}

function off() {
    document.getElementById("overlay").style.display = "none";
}

$(function() {
    // console.log(window.location.pathname)
    // return false;
    // if (window.location.pathname != '/index.html' && (window.location.pathname != '/cadastro/index.html' || window.location.pathname != '/cadastro/')) {
    //     if (getCookie('token') == '' && typeof getCookie('token') == undefined || getCookie('token') == null) {
    //         window.location.href = 'index.html';
    //     } else {

    var logo = "";
    var photo = "";
    var user = "";

    var getImage = $('input[name*="getImage"]').val();
    // getImage = 'true';

    console.log(getImage);
    if (getImage == "true") {
        $.ajax({
            url: "https://api.appdoutor.com/api/user",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Bearer " + getCookie("token"),
            },
            success: function(response) {
                user = response;
                $(".dropdown-menu.dropdown-menu-right .dropdown-header").html(
                    '<i class="i-Lock-User mr-1"></i>' + response.name
                );

                if (1 == 0) {
                    $.ajax({
                        url: "https://api.appdoutor.com/api/clinicas/" + response.idClinica,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Authorization: "Bearer " + getCookie("token"),
                        },
                        success: function(response) {
                            // $.ajax({
                            //     url: "includes/setSession.php",
                            //     type: "POST",
                            //     data: {
                            //         logo: response.logo,
                            //         photo: response.photo,
                            //         // user: user,
                            //     },
                            //     success: function(response) {
                            //         $("#overlay").trigger("click");
                            //     },
                            // });

                            // $.ajax({
                            //   url: "https://api.appdoutor.com/api/image/" + response.logo,
                            //   headers: {
                            //     "Content-Type": "application/x-www-form-urlencoded",
                            //     Authorization: "Bearer " + getCookie("token"),
                            //   },
                            //   type: "GET",
                            //   success: function (response) {
                            //     var json = $.parseJSON(response);
                            //     $(".layout-sidebar-large .main-header .logo img").attr(
                            //       "src",
                            //       json.string
                            //     );
                            //     logo = json.string;
                            //     console.log(logo);
                            //   },
                            // });

                            // $.ajax({
                            //   url: "https://api.appdoutor.com/api/image/" + response.photo,
                            //   headers: {
                            //     "Content-Type": "application/x-www-form-urlencoded",
                            //     Authorization: "Bearer " + getCookie("token"),
                            //   },
                            //   type: "GET",
                            //   success: function (response) {
                            //     var json = $.parseJSON(response);
                            //     $("#userDropdown").attr("src", json.string);
                            //     photo = json.string;

                            //     $.ajax({
                            //       url: "../includes/setSession.php",
                            //       type: "POST",
                            //       data: {
                            //         logo: logo,
                            //         photo: photo,
                            //         user: user,
                            //       },
                            //       success: function (response) {
                            //         $("#overlay").trigger("click");
                            //       },
                            //     });
                            //   },
                            // });
                        },
                        error: function(err) {
                            console.log(err);
                        },
                    });
                }
            },
            error: function(err) {
                console.log(err);
            },
        });
    } else {
        $("#overlay").trigger("click");
    }

    $(".dropdown-item:last-child").on("click", function(e) {
        e.preventDefault();

        $.ajax({
            url: "https://api.appdoutor.com/api/logout",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Bearer " + getCookie("token"),
            },
            type: "POST",
            success: function(response) {
                $.ajax({
                    url: "../includes/removeSession.php",
                    type: "GET",
                    success: function(response) {},
                });

                eraseCookie("token");
                window.location.href = "../";
            },
            error: function(err) {
                console.log(err);
            },
        });
    });

    function blobToBase64(blob) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }
});

$(document).ready(function() {
    $("#date").mask("00/00/0000");
    $("#cep").mask("00000-000");
    $("#celular").mask("(00) 00000-0000");
    $(".mixed").mask("000.000.0000/AA");
    $("#cpf").mask("000.000.000-00", { reverse: true });
    $("#cnpj").mask("00.000.000/0000-00", { reverse: true });
    $(".money").mask("000.000.000.000.000,00", { reverse: true });
    $(".money2").mask("#.##0,00", { reverse: true }); 

    $(".layout-sidebar-large .sidebar-left .navigation-left .nav-item").on(
        "click",
        function(e) {
            e.preventDefault();
            var href = $(this).find("a").attr("href");
            window.location.href = href;
        }
    );
});

//CEP

$(document).ready(function() {
    function limpa_formulário_cep() {
        // Limpa valores do formulário de cep.
        $("#rua").val("");
        $("#neighbor").val("");
        $("#city").val("");
        $("#state").val("");
    }

    //Quando o campo cep perde o foco.
    $("#cep").blur(function() {
        //Nova variável "cep" somente com dígitos.
        var cep = $(this).val().replace(/\D/g, "");

        //Verifica se campo cep possui valor informado.
        if (cep != "") {
            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if (validacep.test(cep)) {
                //Preenche os campos com "..." enquanto consulta webservice.
                $("#rua").val("...");
                $("#neighbor").val("...");
                $("#city").val("...");
                $("#state").val("...");

                //Consulta o webservice viacep.com.br/
                $.getJSON(
                    "https://viacep.com.br/ws/" + cep + "/json/?callback=?",
                    function(dados) {
                        if (!("erro" in dados)) {
                            //Atualiza os campos com os valores da consulta.
                            $("#rua").val(dados.logradouro);
                            $("#neighbor").val(dados.bairro);
                            $("#city").val(dados.localidade);
                            $("#state").val(dados.uf);
                        } //end if.
                        else {
                            //CEP pesquisado não foi encontrado.
                            limpa_formulário_cep();
                            alert("CEP não encontrado.");
                        }
                    }
                );
            } //end if.
            else {
                //cep é inválido.
                limpa_formulário_cep();
                alert("Formato de CEP inválido.");
            }
        } //end if.
        else {
            //cep sem valor, limpa formulário.
            limpa_formulário_cep();
        }
    });
});
$(document).ready(function() {
    $("#alert-success").on("click", function(success) {
        swal({
            type: "success",
            title: "Sucesso!",
            text: "Alterações salvas com sucesso!",
            buttonsStyling: false,
            confirmButtonClass: "btn btn-lg btn-success",
        });
    });
    $("#alert-info").on("click", function() {
        swal({
            type: "info",
            title: "Tem certeza?",
            text: "Essa ação não poderá ser revertida!",
            buttonsStyling: false,
            confirmButtonClass: "btn btn-lg btn-info",
        });
    });
});
