<!-- 
  Content on this page will be displayed on your extension's
  admin page.
-->

@php
$owner = 'towsifkafi';
$repo = 'mctools-pterodactyl';
try {
    $ch = curl_init("https://api.github.com/repos/{$owner}/{$repo}/releases/latest");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERAGENT => 'PHP',
        CURLOPT_HTTPHEADER => ['Accept: application/vnd.github.v3+json'],
        CURLOPT_FAILONERROR => true
    ]);
    $response = curl_exec($ch);
    curl_close($ch);
    $latest = json_decode($response)->tag_name ?? 'No release found';
} catch (Exception $e) {
    $latest = 'Error: ' . $e->getMessage();
}
@endphp

<div class="box box-info">
  <div class="box-header with-border">
    <h3 class="box-title">Addon Information</h3>
  </div>
  <div class="box-body">
    <p>
      <code>{identifier}</code> is the identifier of this extension. <br>
      The current version is <code>v{version}</code>. <br>
      The latest version from GitHub is <code><a href="https://github.com/{{ $owner }}/{{ $repo }}/releases/tag/{{ $latest }}">{{ $latest }}</a></code>.
    </p>
  </div>
</div>