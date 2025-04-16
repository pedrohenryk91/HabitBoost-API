import{ SwaggerOptions } from "@fastify/swagger";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

const DaySchema: object = {
    type:"object",
    properties:{
        "expt":{type:"integer",description:"The expected number of habits to be concluded in the day."},
        "acvd":{type:"integer",description:"The number of habits concluded in the day."}
    },
}

const OptionalDaySchema: object = {
    description:"This is optinal!",
    nullable:true,
    type:"object",
    properties:{
        "expt":{type:"integer",description:"The expected number of habits to be concluded in the day."},
        "acvd":{type:"integer",description:"The number of habits concluded in the day."}
    },
}

const OverviewSchema: object = { 
    description:"An object that contains the data of the habits concluded by the user in a week.",
    type:"object",
    properties:{
        "dom":DaySchema,
        "seg":DaySchema,
        "ter":DaySchema,
        "qua":DaySchema,
        "qui":DaySchema,
        "sex":DaySchema,
        "sab":DaySchema,
    }
}

const OptionalOverviewSchema: object = { 
    description:"An object that contains the data of the habits concluded by the user in a week.",
    type:"object",
    properties:{
        "dom":OptionalDaySchema,
        "seg":OptionalDaySchema,
        "ter":OptionalDaySchema,
        "qua":OptionalDaySchema,
        "qui":OptionalDaySchema,
        "sex":OptionalDaySchema,
        "sab":OptionalDaySchema,
    }
}

export const SwaggerDocumentationOptions:SwaggerOptions = {
    openapi:{
        info:{
            title:"HabitBoostAPI",
            description:"The API of the HabitBoost App",
            version:"0.0.1",
        },
        components:{
            securitySchemes:{
                "BearerAuth":{
                    type:"http",
                    scheme:"bearer",
                    bearerFormat:"JWT"
                }
            }
        },
        paths:{
            "auth/login":{
                "post":{
                    tags:["Auth"],
                    summary:"Login route",
                    description:"Login route. User log in.",
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    properties:{
                                        email:{ description:"The user's email" },
                                        password:{ description:"The user's password" },
                                    },
                                    required:["email","password"],
                                }
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Success, returns the token and the username of the logged one.",
                            content:{
                                "application/json":{
                                    schema:{
                                        properties:{
                                            "token":{
                                                type:"string",
                                                description:"The authorization token"
                                            },
                                            "username":{
                                                type:"string",
                                                description:"The name of the logged user"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        400:{
                            description:"The password is incorrect."
                        },
                        404:{
                            description:"The user email was not found. Or (less chance) the user's profile was not found."
                        },
                    }
                }
            },
            "auth/validate/sendToken":{
                post:{
                    tags:["Auth"],
                    summary:"The route that sends validation token",
                    description:"This route will send the user validation Token to the front, if the email is already registered on the database.",
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    type:"object",
                                    properties:{
                                        "email":{ description:"User email" }
                                    },
                                    required:["email"]
                                },
                            }
                        },
                    },
                    responses:{
                        200:{
                            description:"OK, token sent."
                        },
                        404:{
                            description:"The email was not found on the database."
                        },
                        500:{
                            description:"Unknown error"
                        },
                    },
                }
            },
            "auth/validate/verifyToken":{
                patch:{
                    tags:["Auth"],
                    summary:"The route that verifies a token to validate an user",
                    description:"This route validates a token that's received from the requestBody, if the token is valid (if it was created by the getToken route) it will validate the user which id is on the token.",
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    type:"object",
                                    properties:{
                                        "token":{ description:"The Token that was sent by the user/validation/getToken route" }
                                    },
                                    required:["token"]
                                }
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Success, email validated."
                        },
                        404:{
                            description:"It means that the user id that was in the token was not found in the database",
                        },
                        417:{
                            description:"The token has an specific format, if this code was sent, it means that the token that was passed is incorrect",
                        },
                        500:{
                            description:"Unknown error"
                        }
                    },
                }
            },
            "profile/create":{
                post:{
                    tags:["Profile"],
                    summary:"Route to create an profile",
                    description:"This route creates a new profile",
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    description:"Realize that all properties are optional. This was made so that we can not only create a new profile, but also save one that already exists locally.",
                                    type:"object",
                                    properties:{
                                        "id":{ description:"The profile's id, must ignore if creating an new profile" },
                                        "image_url":{ description:"The image url" },
                                        "created_at":{
                                            type:"string",
                                            format:"date-time",
                                            description:"The date the profile was created at, must ignore if creating an new profile" },
                                        "updated_at":{
                                            type:"string",
                                            format:"date-time",
                                            description:"The date that the profile was updated by the last time,  must ignore if creating an new profile"
                                        },
                                        "total_habit_count":{ description:"The total number of habits concluded by the user, must ignore if creating an new profile" },
                                        "overview":OverviewSchema,
                                    }
                                }
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Success, profile created successfully. Also returns the created profile.",
                            content:{
                                "application/json":{
                                    schema:{
                                        properties:{
                                            "id":{
                                                description:"The profile's id",
                                            },
                                            "image_url":{
                                                description:"The url of the profile image"
                                            },
                                            "total_habit_count":{
                                                type:"number",
                                                description:"The number of habit done"
                                            },
                                            "overview":{
                                                type:"object",
                                                description:"The same kind of overview object up there on the request body."
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        404:{
                            description:"If this code appears here, it means that the user_id was not found."
                        },
                        500:{
                            description:"Unpredicted error."
                        },
                    }
                }
            },
            "user/register":{
                post:{
                    tags:["User"],
                    summary:"Route to create a new user",
                    description:"Creates an new user, which will have an unvalidated status. User must validate it's account.",
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    type:"object",
                                    properties:{
                                        "email":{ description: "User email." },
                                        "password":{ description: "User password, must have at least 6 characters"},
                                        "username":{ description: "Username, must have at least 6 characters and at maximum 20"},
                                    },
                                    required:["email","password","username"],
                                }
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"User created succesfully."
                        },
                        404:{
                            description:"It wasn't possible to find the profile id."
                        },
                        409:{
                            description:"The email or the username is already in use. Verify the error message to know which."
                        },
                        500:{
                            description:"Unknown error"
                        },
                    }
                }
            },
            "user/recover/sendToken":{
                post:{
                    tags:["User"],
                    summary:"Route to send the recover email with the token.",
                    description:"This route sends an email with an token to the user who's id was ",
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    properties:{
                                        "id":{ description:"The id of the user who wants to recover their password." }
                                    },
                                    required:["id"]
                                }
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Success, token sent."
                        },
                        404:{
                            description:"If this code appears, it means that the user id was not found. "
                        },
                        500:{
                            description:"Unspecified error."
                        }
                    }
                }
            },
            "user/recover":{
                patch:{
                    tags:["User"],
                    summary:"Route that ends the recover password process.",
                    description:"This route receives an token and the new password.It will validate the token, if succeeds, than changes the user password to the new one.",
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    properties:{
                                        "new_password":{
                                            description:"The new password to use if the token gets validated."
                                        },
                                        "token":{
                                            description:"The token that's going to be validated, it must have been generated by the user/recover/sendToken route."
                                        },
                                    },
                                    required:["new_password","token"],
                                },
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Success, password changed."
                        },
                        404:{
                            description:"The user was somehow not found.(The user data is in the token.)"
                        },
                        417:{
                            description:"It was not possible to validate the token. This may have happened due to the token been expired or it's format was not correct (it was not generated by the api).",
                        },
                        500:{
                            description:"Unknown error."
                        }
                    }
                }
            },
            "user/edit/username":{
                patch:{
                    tags:["User"],
                    summary:"Route to edit username",
                    description:"Route to edit the user's username",
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    type:"object",
                                    properties:{
                                        "id":{ description:"The user id" },
                                        "username":{ description:"The new username" },
                                    },
                                    required:["id","username"],
                                }
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Success, username changed."
                        },
                        404:{
                            description:"It wasn't possible to find the user id."
                        },
                        409:{
                            description:"The username is already in use."
                        },
                        500:{
                            description:"Unknown error"
                        },
                    }
                }
            },
            "user/get/overview/:username":{
                get:{
                    tags:["User"],
                    summary:"Route to get the overview data of an user",
                    description:"It receives the username of the user than returns the total_habit_count and detailed_habit_count properties of the user.",
                    parameters:[{
                        name:"username",
                        in:"path",
                        required:true,
                        description:"The username of the user that will have the data retrived.",
                        schema:{
                            type:"string",
                        }
                    }],
                    requestBody:{
                        content:{}
                    },
                    responses:{
                        200:{
                            description:"Success.",
                            content:{
                                "application/json":{
                                    schema:{
                                        properties:{
                                            "total_habit_count":{
                                                type:"number",
                                                description:"The total number of habits done."
                                            },
                                            "overview":{ 
                                                description:"An object that contains the data of the habits concluded by the user in a week.",
                                                type:"object",
                                                properties:{
                                                    "dom":{
                                                        type:"object",
                                                        properties:{
                                                            "expt":{type:"integer",description:"The expected number of habits to be concluded in the day."},
                                                            "acvd":{type:"integer",description:"The number of habits concluded in the day."}
                                                        },
                                                    },
                                                    "seg":{
                                                        type:"object",
                                                        properties:{
                                                            "expt":{type:"integer",description:"The expected number of habits to be concluded in the day."},
                                                            "acvd":{type:"integer",description:"The number of habits concluded in the day."}
                                                        },
                                                    },
                                                    "ter":{
                                                        type:"object",
                                                        properties:{
                                                            "expt":{type:"integer",description:"The expected number of habits to be concluded in the day."},
                                                            "acvd":{type:"integer",description:"The number of habits concluded in the day."}
                                                        },
                                                    },
                                                    "qua":{
                                                        type:"object",
                                                        properties:{
                                                            "expt":{type:"integer",description:"The expected number of habits to be concluded in the day."},
                                                            "acvd":{type:"integer",description:"The number of habits concluded in the day."}
                                                        },
                                                    },
                                                    "qui":{
                                                        type:"object",
                                                        properties:{
                                                            "expt":{type:"integer",description:"The expected number of habits to be concluded in the day."},
                                                            "acvd":{type:"integer",description:"The number of habits concluded in the day."}
                                                        },
                                                    },
                                                    "sex":{
                                                        type:"object",
                                                        properties:{
                                                            "expt":{type:"integer",description:"The expected number of habits to be concluded in the day."},
                                                            "acvd":{type:"integer",description:"The number of habits concluded in the day."}
                                                        },
                                                    },
                                                    "sab":{
                                                        type:"object",
                                                        properties:{
                                                            "expt":{type:"integer",description:"The expected number of habits to be concluded in the day."},
                                                            "acvd":{type:"integer",description:"The number of habits concluded in the day."}
                                                        },
                                                    }
                                                }
                                            },
                                        }
                                    }
                                }
                            }
                        },
                        400:{
                            description:"This code showing it's face means that somehow the user doesn't have an profile."
                        },
                        404:{
                            description:"The user was not found."
                        },
                        500:{
                            description:"Unknow error."
                        }
                    }
                }
            },
            "habit/create":{
                post:{
                    tags:["Habit"],
                    summary:"Route to create an habit. NEEDS AUTHORIZATION HEADER",
                    description:"Route that creates an habit.",
                    security:[{ "BearerAuth":[] }],
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    properties:{
                                        "title":{
                                            description:"The title of the habit"
                                        },
                                        "dates":{
                                            type:"array",
                                            items:{
                                                type:"string",
                                                format:"date-time",
                                            },
                                            description:"An array of dates, those are the days that the habit is suppossed to be done."
                                        },
                                        "reminder_time":{
                                            type:"string",
                                            format:"date-time",
                                            description:"The moment (hour) that the reminder of the habit will happen."
                                        },
                                        "description":{
                                            description:"The description of the habit."
                                        },
                                        "category_name":{
                                            description:"The name of the category of the habit (Must exists)."
                                        },
                                    },
                                    required:["title","dates","category_name"],
                                }
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Habit created with success, returns the habit id.",
                            content:{
                                "application/json":{
                                    schema:{
                                        properties:{
                                            "habit_id":{
                                                description:"The id of the created habit."
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        403:{
                            description:"User is not verified."
                        },
                        404:{
                            description:"User or Profile was not found. It specifies which on the message."
                        },
                        500:{
                            description:"Unknown error."
                        }
                    }
                }
            },
            "overview/update":{
                patch:{
                    tags:["Overview"],
                    summary:"Route to update an overview",
                    description:"Route to update an overview, keep in mind that here the days are nullable, making possible to update one day per time.",
                    security:[{ "BearerAuth":[] }],
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    properties:{
                                        "overview":OptionalOverviewSchema,
                                    },
                                    required:["overview"],
                                }
                            },
                        },
                    },
                    responses:{
                        201:{
                            description:"Overview updated"
                        },
                        404:{
                            description:"It was not possible to find the profile (this error is supposed to be impossible!)"
                        },
                        500:{
                            description:"Unknown error"
                        },
                    }
                }
            }
        },
    },
    transform:jsonSchemaTransform,
}