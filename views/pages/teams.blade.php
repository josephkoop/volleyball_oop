<x-layout>

    <h2 class="page_heading">Belize Volleyball Teams</h2>



    <button onclick="event.preventDefault(); event.stopPropagation(); openAddModal(event)" id="addTeamButton" class="button">Add Team</button></br>
    <div id="addTeamModal" class="modal {{ session('form_type') === 'add' ? 'show' : 'hidden' }}">
        <div class="modal-content">
            <form id=addTeamForm action="{{ route('teams.create') }}" method="POST">
                @csrf

                <input type="hidden" name="form_type" value="add"/>

                <div>
                    <label for="name">Name: </label>
                    <input type="text" name="name" value="{{ old('name') }}"/>
                </div>
                <div>
                    <label for="location">Location: </label>
                    <input type="text" name="location" value="{{ old('location') }}"/>
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
                    <button class="button" type="button" onclick="closeEditModal()">Cancel</button>
                </div>
            </form>
        </div>
    </div>



    <div id="editTeamModal" class="modal {{ session('form_type') === 'edit' ? 'show' : 'hidden' }}">
        <div class="modal-content">
            <form id="editTeamForm" action="{{ route('teams.edit', 'teamPlaceholder') }}" method="POST">
                @csrf 
                @method('PUT')

                <input type="hidden" name="form_type" value="edit"/>

                <input type="hidden" name="id" id="editTeamId" value="{{ old('id') }}"/>

                <div>
                    <label for="name">Name: </label>
                    <input type="text" name="name" id="editTeamName" value="{{ old('name') }}"/>
                </div>
                <div>
                    <label for="rank">Rank: </label>
                    <input type="number" name="rank" id="editTeamRank" value="{{ old('rank') }}"/>
                </div>
                <div>
                    <label for="location">Location: </label>
                    <input type="text" name="location" id="editTeamLocation" value="{{ old('location') }}"/>
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
                    <button class="button" type="button" onclick="closeEditModal()">Cancel</button>
                </div>
            </form>
        </div>
    </div>



    <div id="deleteTeamModal" class="modal">
        <div class="modal-content">
            <form id="deleteTeamForm" action="{{ route('teams.delete', 'teamPlaceholder') }}" method="POST">
                @csrf 
                @method('DELETE')
                    <p>Check Javascript</p>
                    <div class="form-button">
                        <button class="button" type="submit">Delete</button>
                        <button class="button" type="button" onclick="closeEditModal()">Cancel</button>
                    </div>
            </form>
        </div>
    </div>



    <ul class="list">
        <li>
            <div>
                <p>Rank</p>
                <p>Name</p>
                <p>Location</p>
                <p></p>
                <p></p>
            </div>
        </li>
        @foreach($teams as $team)
            <li>
                <a class="teamRow" href="{{ route('pages.players', $team->id) }}">
                    <p>{{ $team->rank }}</p>
                    <p>{{ $team->name }}</p>
                    <p>{{$team->location}}</p>

                    <span onclick="event.preventDefault(); event.stopPropagation(); openEditModal('{{ $team->id }}', '{{ $team->name }}', '{{ $team->rank }}', '{{ $team->location }}')">
                        <img class="icon" src="{{ asset('images/edit.png') }}" alt="Edit Icon"/>
                    </span>

                    <span onclick="event.preventDefault(); event.stopPropagation(); openDeleteModal('{{ $team->id }}', '{{ $team->name }}')">
                        <img class="icon" src="{{ asset('images/delete.png') }}" alt="Delete Icon">
                    </span>
                </a>
            </li>
        @endforeach
    </ul>

    
<script>
    function openAddModal(){
        document.getElementById("addTeamModal").classList.add("show");
    }


    function openDeleteModal(id, name){
        let modal = document.getElementById("deleteTeamModal")
        modal.classList.add("show");

        let form = document.getElementById("deleteTeamForm");
        form.action = `{{ route('teams.delete', 'TEAM_ID') }}`.replace('TEAM_ID', id);

        let message = document.querySelector("#deleteTeamModal p");
        message.textContent = `Are you sure you want to delete Team ${name}?`;
    }


    function openEditModal(id, name, rank, location){
        document.getElementById("editTeamId").value = id;
        document.getElementById("editTeamName").value = name;
        document.getElementById("editTeamRank").value = rank;
        document.getElementById("editTeamLocation").value = location;

        let formAction = "{{ route('teams.edit', 'teamPlaceholder') }}";
        formAction = formAction.replace('teamPlaceholder', id);
        document.getElementById("editTeamForm").action = formAction;

        document.getElementById("editTeamModal").classList.add("show");
    }


    function closeEditModal(){      //Full page refresh causing overhead to remove error messages
        window.location.href="{{ route('pages.teams') }}";
    }


    document.addEventListener("click", function(event){
        let editModal = document.getElementById("editTeamModal");
        let editModalContent = document.querySelector("#editTeamModal .modal-content");
        if(editModal.classList.contains("show") && !editModalContent.contains(event.target)){
            closeEditModal();
        }

        let addModal = document.getElementById("addTeamModal");
        let addModalContent = document.querySelector("#addTeamModal .modal-content");
        if(addModal.classList.contains("show") && !addModalContent.contains(event.target)){
            closeEditModal();
        }    
        
        let deleteModal = document.getElementById("deleteTeamModal");
        let deleteModalContent = document.querySelector("#deleteTeamModal .modal-content");
        if(deleteModal.classList.contains("show") && !deleteModalContent.contains(event.target)){
            closeEditModal();
        }   
    });
</script>

</x-layout>