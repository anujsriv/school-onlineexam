var UserProfile = (function() {
    var fullName = "";
    var userName = "";
    var password = "";
    var id = "";
    var schoolName = "";
  
    var getFullName = function() {
      return localStorage.getItem('fullName') || '';
    };
  
    var setFullName = function(name) {
      fullName = name;
      localStorage.setItem('fullName', fullName);
    };

    var getUserName = function() {
      return localStorage.getItem('userName') || '';
    };
    
    var setUserName = function(name) {
      userName = name;     
      localStorage.setItem('userName', userName);
    };

    var getPassword = function() {
      return localStorage.getItem('password') || '';
    };
    
    var setPassword = function(name) {
      password = name;     
      localStorage.setItem('password', password);
    };

    var getId = function() {
      return localStorage.getItem('id') || '';
    };
    
    var setId = function(name) {
      id = name;     
      localStorage.setItem('id', id);
    };

    var getSchoolName = function() {
      return localStorage.getItem('schoolName ') || '';
    };
    
    var setSchoolName = function(name) {
      schoolName = name;     
      localStorage.setItem('schoolName', schoolName);
    };
  
    return {
      getFullName: getFullName,
      setFullName: setFullName,
      getUserName: getUserName,
      setUserName: setUserName,
      getPassword: getPassword,
      setPassword: setPassword,
      getId: getId,
      setId: setId,
      getSchoolName: getSchoolName,
      setSchoolName: setSchoolName
    }
  
  })();
  
  export default UserProfile;