@props(['player'])

<div class="player_card">
    <h3>{{ $player->name }}</h3>
    <img src="{{ asset('storage/' . $player->image) }}" alt="Profile Picture"/> 
    <p>{{ $player->position }}</p>
    <p>#{{ $player->number }}</p>
    <p>Height: {{ $player->height_feet }}' {{ $player->height_inches }}"</p>
    <p>Age: {{ $player->age}}</p>
    <br>

    <div class="player-icons">
        <span onclick="event.preventDefault(); event.stopPropagation(); openEditModalP('{{ $player->id }}', '{{ $player->team_id }}', '{{ $player->name }}', '{{ $player->number }}', '{{ $player->position }}', '{{ $player->height_feet }}', '{{ $player->height_inches }}', '{{ $player->age }}')">
            <img class="icon" src="{{ asset('images/edit.png') }}" alt="Edit Icon"/>
        </span>

        <span onclick="event.preventDefault(); event.stopPropagation(); openDeleteModalP(this, '{{ $player->team_id }}', '{{ $player->id }}', '{{ $player->name }}')">
            <img class="icon" src="{{ asset('images/delete.png') }}" alt="Delete Icon">
        </span>
    </div>
</div> 