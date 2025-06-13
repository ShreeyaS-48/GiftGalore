const verifyRoles = (...allowedRoles) =>{
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401); // no roles info
    
        const rolesArray = [...allowedRoles];
        // Check if user roles include any allowed role
        const hasRole = req.roles.some(role => rolesArray.includes(role));
    
        if (!hasRole) return res.sendStatus(403); // Forbidden if no allowed role
    
        next(); // allowed, continue
      };  
}

export default verifyRoles;