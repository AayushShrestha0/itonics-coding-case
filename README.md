<!DOCTYPE html>
<html lang="en">
<body>
  <h1>Roles and User Management System</h1>

  <p>A simple application built with <strong>Angular 19.2.1</strong> and mocked backend using json-server for managing user roles, permissions, and user information.</p>

<h2>Prerequisites</h2>
  <p>Before starting the project, ensure you have the following installed:</p>
  <ul>
    <li><strong>Node.js:</strong> v20.11.1 or higher</li>
    <li><strong>npm:</strong> v10.2.4 or higher (comes with Node.js)</li>
    <li><strong>Angular CLI:</strong> v19.2.1</li>
  </ul>

  <h2>Installation</h2>
  <p>Follow these steps to get the environment set up:</p>

  <h3>1. Clone the repository:</h3>
  <pre><code>git clone &lt;repository-url&gt;
cd &lt;repository-name&gt;</code></pre>

  <h3>2. Install dependencies for the application:</h3>
  <h4>The following <i> npm i</i> command will install all the necessary dependencies to run the application:</h4>
  <pre><code>cd itonics-coding-case
npm i</code></pre>

  <h3>4. Start the application:</h3>
  <h4>Run the mock backend server (in the <code>backend</code> directory):</h4>
  <pre><code>npx json-server db.json</code></pre>
  <h4>Run the Angular frontend (in the <code>frontend</code> directory):</h4>
  <pre><code>ng serve -o</code></pre>
  <p>This will run the Angular application on <strong>http://localhost:4200</strong> and open the application on your default broswer.</p>
  <p>Run the mock backend first and then start the Angular application!</p>
  <p>If the Angular application is running, but is not showing anything, verify that the mock backend of json-server is running.</p>

  <h3>5. Credentials: </h3>
  <h4> The following is the credentials for the super admin user who can access the role management. </h4>
  <pre><code>
    username: SuperAdmin
    password: super@admin
  </code></pre>
  <p>The credentials for others users can be viewed on the db.json file where all the data is stored. Additional users and roles can be created as needed.</p>
  <h2>Roles Permissions and Features Description</h2>
  <ul>
    <li>Edit: Allows the role to edit user details.</li>
    <li>Add: Allows the role to create new users.</li>
    <li>Delete: Allows the role to delete users.</li>
    <li>View Password: Allows the role to see user's password.</li>
  </ul>
  
  <h2>Application Features</h2>
  <ul>
    <li>CRUD operations for users and roles</li>
    <li>Assign roles and permissions to users</li>
    <li>Edit and delete user details</li>
    <li>User authentication (with simulated session storage)</li>
    <li>Responsive UI with Ant Design Components.</li>
  </ul>

  <h2>Tech Stack</h2>
  <ul>
    <li><strong>Frontend:</strong> Angular 19.2.1</li>
    <li><strong>Backend:</strong> Mock API with json-server</li>
    <li><strong>Database:</strong> Simulated using json-server</li>
  </ul>

  <h2>Project Structure</h2>

  <h3>Frontend (<code>frontend</code>)</h3>
  <ul>
    <li><strong>src/app</strong>: Contains the main components, services, models, guards, resolvers and interceptor files the application.</li>
    <ul>
      <li><strong>content<strong>: Contains all the UI components and their respective files (.html,.css,.ts)</li>
      <ul>
        <li><strong>user:</strong> Contains components for viewing, adding, and editing users.</li>
        <li><strong>role:</strong> Contains components for managing roles.</li>
        <li><strong>login-form:</strong> Contains files for handling login UI and logic.</li>
      </ul>
        <li><strong>layout</strong>: Defines the base layout of the application with sidebar and navigation menus.</li>
        <li><strong>models</strong>: Contains all the interfaces files.</li>
        <li><strong>guards</strong>: Contains logic for handling and securing routes.</li>
        <li><strong>interceptors</strong>: For handling outgoing request.</li>
        <li><strong>resolvers</strong>: Contains logic for fetching data before component loads.</li>
        <li><strong>services</strong>: Files for handling backend requests.</li>
      </ul>
  </ul>

  <h3>Backend (<code>backend</code>)</h3>
  <ul>
    <li><strong>db.json:</strong> Contains mock data for users, roles, and permissions. The JSON Server will serve this data.</li>
  </ul>

  <h2>Important Files</h2>
  <ul>
    <li><code>src/app/services/login.service.ts</code>: Contains logic for handling login functionality.</li>
    <li><code>src/app/services/user.service.ts</code>: Contains logic for interacting with the user-related API endpoints (CRUD).</li>
    <li><code>src/app/services/role.service.ts</code>: Contains logic for interacting with the role-related API endpoints (CRUD).</li>
    <li><code>src/app/components/user-management/user-list.component.ts</code>: Displays the list of users.</li>
    <li><code>src/app/components/role-management/role-list.component.ts</code>: Displays the list of roles.</li>
  </ul>
</body>
</html>
