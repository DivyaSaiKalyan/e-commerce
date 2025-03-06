const asyncHandler = require("express-async-handler");
const Employee = require("../../models/User/employee");
const User = require("../../models/User/user");
const Company = require("../../models/IIO/company");
const MapTeam = require("../../models/User/mapTeam");
const { sequelize } = require("../../config/dbConnection");

//@dec create Employee
//@route POST /user/Employee/create
//@access public
const createEmployee = asyncHandler(async (req, res) => {
  const {
    emp_id,
    user_id,
    area_code,
    company_code,
    name,
    team_id,
    prev_team_id,
  } = req.body;

  if (
    !emp_id ||
    !user_id ||
    !area_code ||
    !company_code ||
    !name ||
    !team_id ||
    !prev_team_id
  ) {
    res.status(400);
    throw new Error("Required fields are missing");
  }

  const checkEmployee = await Employee.findOne({
    where: {
      emp_id: emp_id,
    },
  });
  if (checkEmployee) {
    res.status(400);
    throw new Error("Employee already exists");
  }

  if (user_id) {
    const getUser = await User.findByPk(user_id);
    if (!getUser) {
      res.status(404);
      throw new Error("User not found");
    }
  }

  if (company_code) {
    const getCompany = await Company.findByPk(company_code);
    if (!getCompany) {
      res.status(404);
      throw new Error("Company not found");
    }
  }
  if (team_id) {
    const getMaPTeam = await MapTeam.findByPk(team_id);
    if (!getMaPTeam) {
      res.status(404);
      throw new Error("mapteam not found");
    }
  }
  if (prev_team_id) {
    const getPrevMaPTeam = await MapTeam.findByPk(prev_team_id);
    if (!getPrevMaPTeam) {
      res.status(404);
      throw new Error("PrevMaPTeam not found");
    }
  }

  await sequelize.sync({ alter: true });
  const newEmployee = await Employee.create({
    emp_id,
    user_id,
    area_code,
    company_code,
    name,
    team_id,
    prev_team_id,
  });

  const getEmployee = await Employee.findByPk(newEmployee.id, {
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: Company,
        as: "Company",
      },
      {
        model: MapTeam,
        as: "CurrentTeam",
      },
      {
        model: MapTeam,
        as: "PreviousTeam",
      },
    ],
  });

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: "Employee created successfully",
    data: getEmployee,
  });
});

//@dec update Employee
//@route PUT /user/Employee/Update
//@access public
const updateEmployee = asyncHandler(async (req, res) => {
  const { emp_id } = req.params;
  const {
    user_id,
    area_code,
    company_code,
    name,
    emp_type,
    team_id,
    prev_team_id,
    employment_status,
    date_of_hire,
  } = req.body;
  let getUser;
  let getCompany;
  let getMaPTeam;
  let getPrevMaPTeam;
  const employee = await Employee.findOne({
    where: {
      emp_id: emp_id,
    },
  });

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  if (user_id) {
    getUser = await User.findByPk(user_id);
    if (!getUser) {
      res.status(404);
      throw new Error("User not found");
    }
  }
  if (company_code) {
    getCompany = await Company.findByPk(company_code);
    if (!getCompany) {
      res.status(404);
      throw new Error("Company not found");
    }
  }
  if (team_id) {
    getMaPTeam = await MapTeam.findByPk(team_id);
    if (!getMaPTeam) {
      res.status(404);
      throw new Error("mapteam not found");
    }
  }
  if (prev_team_id) {
    getPrevMaPTeam = await MapTeam.findByPk(prev_team_id);
    if (!getPrevMaPTeam) {
      res.status(404);
      throw new Error("PrevMaPTeam not found");
    }
  }
  await sequelize.sync({ alter: true });
  await employee.update(
    {
      user_id: getUser?.dataValues?.id || employee.dataValues.user_id,
      area_code: area_code || employee.dataValues.area_code,
      company_code:
        getCompany?.dataValues?.id || employee.dataValues.company_code,
      name: name || employee.dataValues.name,
      emp_type: emp_type || employee.dataValues.emp_type,
      team_id: getMaPTeam?.dataValues?.id || employee.dataValues.team_id,
      prev_team_id:
        getPrevMaPTeam?.dataValues?.id || employee.dataValues.prev_team_id,
      employment_status:
        employment_status || employee.dataValues.employment_status,
      date_of_hire: date_of_hire || employee.dataValues.date_of_hire,
    },
    {
      where: {
        emp_id: emp_id,
      },
    }
  );

  const getUpdatedEmploye = await Employee.findByPk(employee.dataValues.id, {
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: Company,
        as: "Company",
      },
      {
        model: MapTeam,
        as: "CurrentTeam",
      },
      {
        model: MapTeam,
        as: "PreviousTeam",
      },
    ],
  });
  res.json({
    statusCode: 200,
    success: true,
    message: "Employee updated successfully",
    data: getUpdatedEmploye,
  });
});

//@dec get Employee
//@route POST /user/Employee/getbyid
//@access public
const getEmployeeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await sequelize.sync({ alter: true });
  const employee = await Employee.findByPk(id, {
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: Company,
        as: "Company",
      },
      {
        model: MapTeam,
        as: "CurrentTeam",
      },
      {
        model: MapTeam,
        as: "PreviousTeam",
      },
    ],
  });

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Employee found successfully",
    data: employee,
  });
});

//@dec get Employees
//@route POST /user/Employees/all
//@access public
const getAllEmployees = asyncHandler(async (req, res) => {
  await sequelize.sync({ alter: true });
  const employees = await Employee.findAll();
  const groupedEmployees = employees.reduce((acc, emp) => {
    let areaGroup = acc.find((group) => group.area_code === emp.area_code);
    if (!areaGroup) {
      areaGroup = { area_code: emp.area_code, employees: [] };
      acc.push(areaGroup);
    }
    areaGroup.employees.push(emp);
    return acc;
  }, []);

  res.json(groupedEmployees);
});

module.exports = {
  createEmployee,
  updateEmployee,
  getEmployeeById,
  getAllEmployees,
};
