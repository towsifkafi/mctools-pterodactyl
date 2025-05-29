<!-- 
  Content on this page will be displayed on your extension's
  admin page.
-->

@php
  $isEnabled = TRUE;
@endphp

@if($isEnabled)
  <h1>Extension is enabled!</h1>
@else
  <h1>Extension is not enabled.</h1>
@endif