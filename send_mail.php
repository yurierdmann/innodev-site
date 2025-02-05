<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Captura e sanitiza os dados
    $name = htmlspecialchars(strip_tags(trim($_POST["name"])));
    $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(strip_tags(trim($_POST["message"])));

    // Validação básica
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(["status" => "error", "message" => "Todos os campos são obrigatórios."]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "E-mail inválido."]);
        exit;
    }

    // Configuração do e-mail
    $to = "innodevoficial@gmail.com"; // Alterar para o e-mail de recebimento
    $subject = "Novo Contato do Site InnoDev";
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $body = "Nome: $name\n";
    $body .= "E-mail: $email\n\n";
    $body .= "Mensagem:\n$message\n";

    // Envio do e-mail
    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(["status" => "success", "message" => "Mensagem enviada com sucesso!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Erro ao enviar a mensagem."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Método inválido."]);
}
?>
