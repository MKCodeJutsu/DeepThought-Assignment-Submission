  let students = [];

  // Fetch the students data from the JSON file
  fetch('/students.json')
    .then(response => response.json())
    .then(data => {
      students = data;
    });

  // Function to display the students in a table
  function displayStudents(studentArray) {
    const studentTable = document.getElementById('studentTable');
    studentTable.innerHTML = `
      <table class="table table-dark">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th class="table-header-btn">
              <button class="btn-add-student" data-toggle="modal" data-target="#addStudentModal">
                +
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          ${studentArray.map(student => `
            <tr>
              <td>${student.name}</td>
              <td>${student.age}</td>
              <td>${student.gender}</td>
              <td><button class="btn btn-sm btn-warning" onclick="editStudent('${student.name}')">Edit</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
  
  // Function to filter the students based on the input criteria
  function filterStudents() {
    const searchName = document.getElementById('searchName').value.toLowerCase();
    const filterGender = document.getElementById('filterGender').value.toLowerCase();
    const filterAge = document.getElementById('filterAge').value;

    let filteredStudents = students.filter(student => {
      const matchesName = searchName === '' || student.name.toLowerCase().includes(searchName);
      const matchesGender = filterGender === '' || student.gender.toLowerCase() === filterGender;
      const matchesAge = filterAge === '' || ageInRange(student.age, filterAge);

      return matchesName && matchesGender && matchesAge;
    });

    displayStudents(filteredStudents);
  }

  // Function to check if age is within the specified range
  function ageInRange(age, range) {
    const [min, max] = range.split('-').map(Number);
    return age >= min && age <= max;
  }

  // Function to toggle between showing and hiding all students
  function toggleShowAllStudents() {
    const showAllButton = document.getElementById('showAllButton');
    const isShowing = showAllButton.getAttribute('data-showing') === 'true';

    if (isShowing) {
      document.getElementById('studentTable').innerHTML = '';
      showAllButton.setAttribute('data-showing', 'false');
      showAllButton.textContent = 'Show All Students';
    } else {
      displayStudents(students);
      showAllButton.setAttribute('data-showing', 'true');
      showAllButton.textContent = 'Hide All Students';
    }
  }

  // Event listeners for the buttons
  document.getElementById('searchButton').addEventListener('click', filterStudents);
  document.getElementById('showAllButton').addEventListener('click', toggleShowAllStudents);

  // Function to edit a student's information
  function editStudent(name) {
    const student = students.find(s => s.name === name);
    document.getElementById('editStudentName').value = student.name;
    document.getElementById('editStudentAge').value = student.age;
    document.getElementById('editStudentGender').value = student.gender;

    $('#editStudentModal').modal('show');

    document.getElementById('saveStudentButton').onclick = function() {
      student.name = document.getElementById('editStudentName').value;
      student.age = document.getElementById('editStudentAge').value;
      student.gender = document.getElementById('editStudentGender').value;

      displayStudents(students);
      $('#editStudentModal').modal('hide');
    }
  }

  // Event listener for adding a new student
  document.getElementById('addNewStudentButton').addEventListener('click', function() {
    const newStudent = {
      name: document.getElementById('newStudentName').value,
      age: document.getElementById('newStudentAge').value,
      gender: document.getElementById('newStudentGender').value
    };

    students.push(newStudent);
    displayStudents(students);
    $('#addStudentModal').modal('hide');
  });

