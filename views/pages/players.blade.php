<x-layout>

    <h2 class="page_heading">{{ $team->name }}</h2>
    <div class="player-heading">
        <button class="button" onclick="window.location.href='{{ route('pages.teams') }}'">Back</button>
        <div>
            <p class="center">Rank: {{ $team->rank }}</p>
            <p class="center">{{ $team->location }}</p>
        </div>
        <button id="addPlayerButton" class="button" onclick="event.preventDefault(); event.stopPropagation(); openAddModalP(event)">Add Player</button>
    </div>

    <br><br>


    <div class="player_card_container">
        @foreach($players as $player)
            <x-player-card :player="$player"/>
        @endforeach
    </div>

    <div id="addPlayerModal" class="modal {{ session('form_type') === 'add' ? 'show' : 'hidden' }}">            <!-- Consider validating both at the html form and in the controller file -->
        <div class="modal-content">
            <form id=addPlayerForm action="{{ route('players.create', ['team_id' => $team->id]) }}" method="POST" enctype="multipart/form-data">
                @csrf

                <input type="hidden" name="form_type" value="add"/>

                <input type="hidden" name="team_id" value="{{ $team->id }}">

                <div>
                    <label for="name">Name: </label>
                    <input type="text" name="name" value="{{ old('name') }}"/>
                </div>
                <div>
                    <label for="number">Number: </label>
                    <input type="number" name="number" value="{{ old('number') }}"/>
                </div>
                <div>
                    <label for="position">Position: </label>
                    <select name="position" value="{{ old('position') }}">
                        <option value="" disabled selected>Select Position</option>
                        <option value="Setter">Setter</option>
                        <option value="Libero">Libero</option>
                        <option value="Outside Hitter">Outside Hitter</option>
                        <option value="Middle Blocker">Middle Blocker</option>
                        <option value="Opposite">Opposite</option>
                    </select>
                </div>
                <div class="height">
                    <label for="height_feet">Height: </label>
                    <div>
                        <input type="number" name="height_feet" value="{{ old('height_feet') }}"/>
                        <input type="number" name="height_inches" value="{{ old('height_inches') }}"/>
                    </div>
                </div>
                <div>
                    <label for="age">Age: </label>
                    <input type="number" name="age" value="{{ old('age') }}"/>
                </div>
                <div>
                    <label for="image">Upload Image: </label>
                    <input type="file" name="image"/>       <!-- Add value-old later -->
                </div>
                @if($errors->any())
                        <ul class="error-container">
                            @foreach ($errors->all() as $error)
                                <li class="error-message">{{ $error }}</li>
                            @endforeach
                        </ul>
                    @endif                
                <div class="form-button">
                    <button class="button" type="submit">Add</button>
                    <button class="button" type="button" onclick="closeEditModalP()">Cancel</button>
                </div>
            </form>
        </div>
    </div>



    <div id="editPlayerModal" class="modal {{ session('form_type') === 'edit' ? 'show' : 'hidden' }}">
        <div class="modal-content">
            <form id="editPlayerForm" action="{{ route('players.edit', ['team_id' => $team->id, 'id' => 'playerPlaceholder']) }}" method="POST">
                @csrf 
                @method('PUT')

                <input type="hidden" name="form_type" value="edit"/>

                <input type="hidden" name="id" id="editPlayerId" value="{{ old('id') }}"/>

                <div>
                    <label for="name">Name: </label>
                    <input type="text" name="name" id="editPlayerName" value="{{ old('name') }}"/>
                </div>
                <div>
                    <label for="team_id">Team: </label>
                    <select name="team_id" id="editPlayerTeam">
                        @foreach($teams as $team)
                            <option value="{{ $team->id }}" {{ $team->id == old('team_id') ? 'selected' : '' }}>
                                {{ $team->name }}
                            </option>
                        @endforeach
                    </select>

                        
                </div>
                <div>
                    <label for="number">Number: </label>
                    <input type="number" name="number" id="editPlayerNumber" value="{{ old('number') }}"/>
                </div>
                <div>
                    <label for="position">Position: </label>
                    <select name="position" id="editPlayerPosition" value="{{ old('position') }}">
                        <option value="" disabled selected>Select Position</option>
                        <option value="Setter">Setter</option>
                        <option value="Libero">Libero</option>
                        <option value="Outside Hitter">Outside Hitter</option>
                        <option value="Middle Blocker">Middle Blocker</option>
                        <option value="Opposite">Opposite</option>
                    </select>
                </div>
                <div class="height">
                    <label for="height_feet">Height: </label>
                    <div>
                        <input type="number" name="height_feet" id="editPlayerHeightFeet" value="{{ old('height_feet') }}"/>
                        <input type="number" name="height_inches" id="editPlayerHeightInches" value="{{ old('height_inches') }}"/>
                    </div>
                </div>
                <div>
                    <label for="age">Age: </label>
                    <input type="number" name="age" id="editPlayerAge" value="{{ old('age') }}"/>
                </div>
                <div>
                    <label for="image">Upload Image: </label>
                    <input type="file" name="image"/>       <!-- Add value-old later -->
                </div>
                <div>
                    @if($errors->any())
                        <ul class="error-container">
                        @foreach($errors->all() as $error)
                            <li class="error-message">{{ $error }}</li>
                        @endforeach
                        </ul>
                    @endif
                </div>
                <div class="form-button">
                    <button class="button" type="submit">Update</button>
                    <button class="button" type="button" onclick="closeEditModalP()">Cancel</button>
                </div>
            </form>
        </div>
    </div>



    <div id="deletePlayerModal" class="modal">
        <div class="modal-content">
            <form id="deletePlayerForm" action="{{ route('players.delete', ['team_id' => 'teamPlaceholder', 'id' => 'playerPlaceholder']) }}" method="POST">
                @csrf 
                @method('DELETE')
                    <p>Check Javascript</p>
                    <container class="form-button">
                        <button class="button" type="submit">Delete</button>
                        <button class="button" type="button" onclick="closeEditModalP()">Cancel</button>
                    </container>
            </form>
        </div>
    </div>



    <script>
        function openAddModalP(){
            document.getElementById("addPlayerModal").classList.add("show");
        }


        function openDeleteModalP(element, teamId, playerId, name){
            let modal = document.getElementById("deletePlayerModal")
            modal.classList.add("show");

            let form = document.getElementById("deletePlayerForm");

            let deleteUrl = "{{ route('players.delete', ['team_id' => ':teamId', 'id' => ':playerId']) }}"
                .replace(':teamId', teamId)
                .replace(':playerId', playerId);

            form.action = deleteUrl;

            let message = document.querySelector("#deletePlayerModal p");
            message.textContent = `Are you sure you want to delete Player ${name}?`;
        }


        function openEditModalP(playerId, teamId, name, number, position, heightFeet, heightInches, age){
            document.getElementById("editPlayerId").value = playerId;
            document.getElementById("editPlayerName").value = name;
            document.getElementById("editPlayerTeam").value = teamId;
            document.getElementById("editPlayerNumber").value = number;
            document.getElementById("editPlayerPosition").value = position;
            document.getElementById("editPlayerHeightFeet").value = heightFeet;
            document.getElementById("editPlayerHeightInches").value = heightInches;
            document.getElementById("editPlayerAge").value = age;
        
            let formAction = "{{ route('players.edit', ':teamId', ':playerId') }}";
            action = formAction.replace(':teamId' => teamId, ':playerId => playerId');
            document.getElementById("editPlayerForm").action = formAction;

            document.getElementById("editPlayerModal").classList.add("show");
        }


        function closeEditModalP(){      //Full page refresh causing overhead to remove error messages
            let url = window.location.pathname;
            let segments = url.split('/');
            let teamId = segments[2];

            let teamRoute = "{{ route('pages.players', ':id') }}";
            let finalUrl = teamRoute.replace(':id', teamId);
            window.location.href = finalUrl;
        }


        document.addEventListener("click", function(event){
            let editModal = document.getElementById("editPlayerModal");
            let editModalContent = document.querySelector("#editPlayerModal .modal-content");
            if(editModal.classList.contains("show") && !editModalContent.contains(event.target)){
                closeEditModalP();
            }

            let addModal = document.getElementById("addPlayerModal");
            let addModalContent = document.querySelector("#addPlayerModal .modal-content");
            if(addModal.classList.contains("show") && !addModalContent.contains(event.target)){
                closeEditModalP();
            }    
            
            let deleteModal = document.getElementById("deletePlayerModal");
            let deleteModalContent = document.querySelector("#deletePlayerModal .modal-content");
            if(deleteModal.classList.contains("show") && !deleteModalContent.contains(event.target)){
                closeEditModalP();
            }   
        });
    </script>
</x-layout>