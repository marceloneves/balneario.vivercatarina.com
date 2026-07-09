<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido.']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados inválidos.']);
    exit;
}

$SITE_NAME = 'Viver Catarina';
$WHATSAPP = '5548988105199';
$LEADS_DIR = dirname($_SERVER['DOCUMENT_ROOT']) . '/../leads';
$LEADS_FILE = $LEADS_DIR . '/' . basename($_SERVER['HTTP_HOST'] ?? 'site') . '-whatsapp-leads.json';

function localDigits($phone) {
    $d = preg_replace('/\D/', '', (string)($phone ?? ''));
    if (strpos($d, '55') === 0 && strlen($d) > 11) { $d = substr($d, 2); }
    return $d;
}

$name = trim((string)($body['name'] ?? ''));
// Os hubs de bairro do blog (blog-hub-<cluster>) pedem só nome e e-mail.
$isNewsletter = strncmp((string)($body['source'] ?? ''), 'blog-hub-', 9) === 0;

if (strlen($name) < 2) {
    http_response_code(400);
    echo json_encode(['error' => 'Informe seu nome.']);
    exit;
}

if ($isNewsletter) {
    $email = trim((string)($body['email'] ?? ''));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Informe um e-mail válido.']);
        exit;
    }
} else {
    $digits = localDigits($body['phone'] ?? '');
    if (strlen($digits) < 10 || strlen($digits) > 11) {
        http_response_code(400);
        echo json_encode(['error' => 'Informe um telefone válido com DDD.']);
        exit;
    }
}

@mkdir($LEADS_DIR, 0750, true);
$leads = file_exists($LEADS_FILE) ? (json_decode(file_get_contents($LEADS_FILE), true) ?: []) : [];

$entry = [
    'id' => bin2hex(random_bytes(16)),
    'name' => $name,
    'phone' => isset($body['phone']) ? trim((string)$body['phone']) : null,
    'phoneDigits' => isset($body['phone']) ? localDigits($body['phone']) : null,
    'email' => isset($body['email']) ? trim((string)$body['email']) : null,
    'source' => $body['source'] ?? 'unknown',
    'pageUrl' => $body['pageUrl'] ?? null,
    'propertySlug' => $body['propertySlug'] ?? null,
    'createdAt' => gmdate('c'),
];
$leads[] = $entry;

if (file_put_contents($LEADS_FILE, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n", LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Não foi possível registrar seu contato.']);
    exit;
}

http_response_code(201);
if ($isNewsletter) {
    echo json_encode(['ok' => true, 'id' => $entry['id']]);
} else {
    $msg = !empty($body['propertyTitle'])
        ? "Olá! Meu nome é {$name}. Tenho interesse no imóvel {$body['propertyTitle']}."
        : "Olá! Meu nome é {$name}. Vim pelo site {$SITE_NAME} e gostaria de mais informações.";
    echo json_encode(['ok' => true, 'id' => $entry['id'], 'redirectUrl' => "https://wa.me/{$WHATSAPP}?text=" . rawurlencode($msg)]);
}
