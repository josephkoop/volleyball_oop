<h2 class=round_card_name>{{ $round->name }}</h2>

<div class="round_card">

    @foreach ($round->games as $game)
        <div class="game_division">
            @if($game->team1_id == $game->winner_id)
                <h3><strong>{{$game->team1->name }}</strong> - {{ $game->team2->name }}</h3>
            @else
                <h3>{{$game->team1->name }} - <strong>{{ $game->team2->name }}</strong></h3>
            @endif

            @foreach ($game->sets as $index => $set)
                @if($set->points1 > $set->points2)
                    <p><strong>{{ $set->points1 }}</strong> - {{ $set->points2 }}</p>
                @else
                    <p>{{ $set->points1 }} - <strong>{{ $set->points2 }}</strong></p>
                @endif
            @endforeach
        </div> 
    @endforeach

</div>