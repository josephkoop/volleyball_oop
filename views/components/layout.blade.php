<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BVA</title>

    @vite('resources/css/app.css')
</head>
<body>
    <nav class="nav">
        <a id="name" href="{{ route('pages.home') }}">Belize Volleyball Association</a>
        <a href="{{ route('pages.home') }}">Home</a>
        <a href="{{ route('pages.tournaments') }}">Tournaments</a>
        <a href="{{ route('pages.teams') }}">Teams</a>
    </nav>


    @if(session('success'))
        <div class="flash">
            {{ session('success') }}
        </div>
    @endif
 
    
    <main>
        {{ $slot }}
    </main>

    @vite('resources/js/app.js')
</body>
</html>