function fetchData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data); // Resolve the promise with the fetched data
      })
      .catch((error) => {
        reject(error); // Reject the promise if there's an error
      });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const dropdownMenuBrand = document.getElementById("dropdownMenubrand");

  // Function to handle brand item click
  function handleBrandItemClick(code) {
    console.log("Selected brand:", code);
    // You can perform further actions with the selected brand here
  }

  // Fetching brand data
  const apiUrl = `https://parallelum.com.br/fipe/api/v1/carros/marcas/`;
  fetchData(apiUrl)
    .then((data) => {
      console.log("Data fetched successfully:", data);
      data.forEach((brand) => {
        let dropdownItemBrand = document.createElement("li");
        let brandName = brand.nome;
        let code = brand.codigo;
        let displayBrandName = document.createElement("a");
        displayBrandName.className = "dropdown-item";
        displayBrandName.innerText = brandName;

        // Attach click event listener to each brand dropdown item
        displayBrandName.addEventListener("click", function () {
          handleBrandItemClick(code); // Pass the brand data to the handler
          const modelUrl = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${code}/modelos`;

          // Fetching model data for the selected brand
          fetchData(modelUrl)
            .then((modelData) => {
              console.log(modelData);
              const dropdownMenuModel =
                document.getElementById("dropdownMenumodel");
              function handleModelItemClick(code) {
                console.log("Selected brand:", code);
               
              }
              dropdownMenuModel.innerHTML = ""; // Clear previous model items
              modelData.modelos.forEach((model) => {
                let dropdownItemModel = document.createElement("li");
                let modelName = model.nome;
                let modelCode = model.codigo;
                console.log(modelName);
                let displayModelName = document.createElement("a");
                displayModelName.className = "dropdown-item";
                displayModelName.innerText = modelName;

                
                displayModelName.addEventListener("click", function () {
                  handleModelItemClick(modelCode); // Pass the model data to the handler
                  const yearUrl = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${code}/modelos/${modelCode}/anos/`;

                  // Fetching year data for the selected model
                  fetchData(yearUrl)
                    .then((yearData) => {
                      console.log(yearData);
                      const dropdownMenuYear =
                        document.getElementById("dropdownMenuYear");
                      function handleYearItemClick(code) {
                        console.log("Selected brand:", code);
                      }
                      dropdownMenuYear.innerHTML = ""; 
                      yearData.forEach((year) => {
                        let dropdownItemYear = document.createElement("li");
                        let yearCode = year.codigo;
                        let yearName = year.nome;
                        let displayYear = document.createElement("a");
                        displayYear.className = "dropdown-item";
                        displayYear.innerText = yearName;

                       
                        displayYear.addEventListener("click", function () {
                          handleYearItemClick(yearCode);
                          // Pass the year data to the handler
                          const carUrl = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${code}/modelos/${modelCode}/anos/${yearCode}`;
                          fetchData(carUrl).then((cardata) => {
                            console.log(cardata);

                            let container =
                              document.getElementById("container");
                            let card = document.createElement("div");
                            card.className = "card rounded";
                            let carMake = cardata.Marca;
                            let carMakeYear = cardata.AnoModelo;
                            let fuel = cardata.Combustivel;
                            let carModel = cardata.Modelo;
                            let carValue = cardata.Valor;
                            let arr = [];
                            arr.push(carValue);
                            let splitArr = arr[0].split(" ");
                            let carPrice = splitArr[1];
                            // console.log(splitArr);

                            let cardBody = document.createElement("div");
                            cardBody.className = "card-body";
                            cardBody.innerHTML = `
                              <h1 class="title">${carMake}</h1>
                              <p>Model : <span> ${carModel}</span></p>
                              <p>Fuel : <span>${fuel}</span></p>
                              <p>Year of Manufacturing : <span>${carMakeYear}</span></p>
                              <p>Price : $ <span>${carPrice}</span></p>
                              
                              
                              `;
                            console.log(carMake);
                            card.append(cardBody);
                            container.append(card);
                          });
                        });

                        dropdownItemYear.appendChild(displayYear);
                        dropdownMenuYear.appendChild(dropdownItemYear);
                      });
                    })
                    .catch((yearError) => {
                      console.error("Error fetching year data:", yearError);
                    });
                });

                dropdownItemModel.appendChild(displayModelName);
                dropdownMenuModel.appendChild(dropdownItemModel);
              });
            })
            .catch((modelError) => {
              console.error("Error fetching model data:", modelError);
            });
        });

        dropdownItemBrand.appendChild(displayBrandName);
        dropdownMenuBrand.appendChild(dropdownItemBrand);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      // Handle the error
    });
});
