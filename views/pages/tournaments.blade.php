<x-layout>

    <h1 class="page_heading">Tournaments</h1>

    <div id="current_content">
        <h2>Current Tournaments</h2>

        @foreach($ongoingTournaments as $tournament)
            <a href="{{ route('pages.events', $tournament->id) }}"><x-tournament-card :tournament="$tournament"/></a>
        @endforeach
    </div>

    <div class="status_bar">
        <button id="finished_button" class="selected_status">Finished</button>
        <button id="upcomming_button">Upcomming</button>
    </div>

    <div id="finished_content">
        <p>Finished Tournaments</p>

        @foreach($finishedTournaments as $tournament)
            <a href="{{ route('pages.events', $tournament->id) }}"><x-tournament-card :tournament="$tournament"/></a>
        @endforeach
    </div>

    <div id="upcomming_content" class="hidden">
        <p>Upcomming Tournaments</p>

        @foreach($futureTournaments as $tournament)
            <a href="{{ route('pages.events', $tournament->id) }}"><x-tournament-card :tournament="$tournament"/></a>
        @endforeach
    </div>
</x-layout>