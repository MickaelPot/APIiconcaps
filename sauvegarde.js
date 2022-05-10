async function renvoiListeUsers(){
    const tableauUser= async () => {
    let tabUser= new Array();
    const users = await asyncExample()
    
    users.forEach(element => {
      const utilisateur= new classUser(element);
      tabUser.push(utilisateur);
  })
  
  //a remplacer par le renvoi au client
  pourImpressionplustard(tabUser)
  };
  return await tableauUser;
  }
  
  function pourImpressionplustard(tableau){
    console.log(tableau);
  }
  
  const truc = renvoiListeUsers();