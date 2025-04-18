<x-layout>

    <x-tournament-card :tournament="$tournament"/>

    <div class="round_card_container">    
        @foreach($tournament->rounds as $round)
            <x-round-card :round="$round"/>
        @endforeach
    </div>


</x-layout>