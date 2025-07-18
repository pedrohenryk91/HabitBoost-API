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

const HabitSchema: object = {
    type:"object",
    properties:{
        "id":{
            description:"The habit id"
        },
        "title":{
            description:"The title of the habit"
        },
        "days":{
            type:"array",
            items:{
                type:"string"
            }
        },
        "createdAt":{
            type:"string",
            format:"date-time",
        },
        "updatedAt":{
            type:"string",
            format:"date-time",
        },
        "reminderTime":{
            type:"string",
            format:"date-time",
            description:"The moment (hour) that the reminder of the habit will happen."
        },
        "description":{
            description:"The description of the habit."
        },
        "categoryId":{
            description:"The id of the category of the habit (Must exists)."
        },
        "statusByDate":{
            type:"object"
        }
    },
    required:["id","title","days","categoryId","statusByDate"]
}

const GoalSchema: object = {
    type:"object",
    properties:{
        "id":{ description:"The id of the Goal" },
        "title":{ description:"The title of the Goal" },
        "createdAt":{
            type:"string",
            format:"date-time",
        },
        "updatedAt":{
            type:"string",
            format:"dade-time",
        },
        "habitId":{
            description:"The id of the habit which was connected with the goal"
        },
        "targetCount":{
            type:"number",
            description:"The target count of the goal"
        },
        "currentCount":{
            type:"number",
            description:"The current count of the goal"
        }
    },
    required:["id","title","habitId","targetCount"]
}

const CategorySchema: object = {
                                    properties:{
                                        "id":{
                                            type:"string"
                                        },
                                        "name":{
                                            type:"string"
                                        },
                                        "iconId":{
                                            type:"string"
                                        },
                                        "isCustom":{
                                            type:"boolean"
                                        },
                                        "createdAt":{
                                            type:"string",
                                            format:"date-time"
                                        },
                                        "updatedAt":{
                                            type:"string",
                                            format:"date-time"
                                        }
                                    },
                                    required:["id","name","iconId","isCustom"]
}

export const SwaggerDocumentationOptions:SwaggerOptions = {
    openapi:{
        info:{
            title:"HabitBoostAPI",
            description:"The API of the HabitBoost App\n\n",
            version:"0.0.1",
        },
        components:{
            securitySchemes:{
                "BearerAuth":{
                    type:"http",
                    scheme:"bearer",
                    bearerFormat:"JWT"
                },
            }
        },
        paths:{
            "auth/login":{//OK
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
            // "auth/validate/sendToken":{
            //     post:{
            //         tags:["Auth"],
            //         summary:"The route that sends validation token",
            //         description:"This route will send the user validation Token to the front, if the email is already registered on the database.",
            //         requestBody:{
            //             content:{
            //                 "application/json":{
            //                     schema:{
            //                         type:"object",
            //                         properties:{
            //                             "email":{ description:"User email" }
            //                         },
            //                         required:["email"]
            //                     },
            //                 }
            //             },
            //         },
            //         responses:{
            //             200:{
            //                 description:"OK, token sent."
            //             },
            //             404:{
            //                 description:"The email was not found on the database."
            //             },
            //             500:{
            //                 description:"Unknown error"
            //             },
            //         },
            //     }
            // },
            "auth/validate/verifyToken":{//OK
                patch:{
                    tags:["Auth"],
                    summary:"The route that verifies a token to validate an user",
                    description:"This route validates a token that's received from the requestBody, if the token is valid, it will validate the user which id is on the token.",
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    type:"object",
                                    properties:{
                                        "token":{ description:"The Token that was sent to validate the user" }
                                    },
                                    required:["token"]
                                }
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Success, email validated.",
                            content:{
                                "application/json":{
                                    schema:{
                                        properties:{
                                            "token":{description:"The authorization token."}
                                        }
                                    }
                                }
                            }
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
            "ranking":{//OK
                get:{
                    tags:["Ranking"],
                    summary:"Route to get the ranking",
                    security:[{"BearerAuth":[]}],
                    responses:{
                        201:{
                            description:"ok",
                            content:{
                                "application/json":{
                                    schema:{
                                        properties:{
                                            "username":{
                                                description:"The name of the user"
                                            },
                                            "imageUrl":{
                                                description:"Url of the user image"
                                            },
                                            "weektotal":{
                                                type:"number",
                                                description:"The total of the week of the user"
                                            },
                                            "position":{
                                                type:"number",
                                                description:"The position of the user in the ranking"
                                            },
                                        }
                                    }
                                }
                            }
                        },
                        404:{
                            description:"User not found"
                        },
                        500:{
                            description:"Unknown error"
                        }
                    }
                }
            },
            // "profile/create":{
            //     post:{
            //         tags:["Profile"],
            //         summary:"Route to create an profile",
            //         description:"This route creates a new profile",
            //         requestBody:{
            //             content:{
            //                 "application/json":{
            //                     schema:{
            //                         description:"Realize that all properties are optional. This was made so that we can not only create a new profile, but also save one that already exists locally.",
            //                         type:"object",
            //                         properties:{
            //                             "id":{ description:"The profile's id, must ignore if creating an new profile" },
            //                             "image_url":{ description:"The image url" },
            //                             "created_at":{
            //                                 type:"string",
            //                                 format:"date-time",
            //                                 description:"The date the profile was created at, must ignore if creating an new profile" },
            //                             "updated_at":{
            //                                 type:"string",
            //                                 format:"date-time",
            //                                 description:"The date that the profile was updated by the last time,  must ignore if creating an new profile"
            //                             },
            //                             "total_habit_count":{ description:"The total number of habits concluded by the user, must ignore if creating an new profile" },
            //                             "overview":OverviewSchema,
            //                         }
            //                     }
            //                 }
            //             }
            //         },
            //         responses:{
            //             201:{
            //                 description:"Success, profile created successfully. Also returns the created profile.",
            //                 content:{
            //                     "application/json":{
            //                         schema:{
            //                             properties:{
            //                                 "id":{
            //                                     description:"The profile's id",
            //                                 },
            //                                 "image_url":{
            //                                     description:"The url of the profile image"
            //                                 },
            //                                 "total_habit_count":{
            //                                     type:"number",
            //                                     description:"The number of habit done"
            //                                 },
            //                                 "overview":{
            //                                     type:"object",
            //                                     description:"The same kind of overview object up there on the request body."
            //                                 }
            //                             }
            //                         }
            //                     }
            //                 }
            //             },
            //             404:{
            //                 description:"If this code appears here, it means that the user_id was not found."
            //             },
            //             500:{
            //                 description:"Unpredicted error."
            //             },
            //         }
            //     }
            // },
            "profile/get/categories":{//OK
                get:{
                    tags:["Profile"],
                    summary:"Get the user's categories",
                    security:[{"BearerAuth":[]}],
                    description:"Get the user's categories. Named profile because tecnically it's profile not user.",
                    responses:{
                        200:{
                            description:"Okay, found",
                            content:{
                                "application/json":{
                                    schema:{
                                        type:"array",
                                        items:{
                                            properties:{
                                                "id":{
                                                    description:"The id of the category"
                                                },
                                                "name":{
                                                    description:"The title of the category"
                                                },
                                                "iconId":{
                                                    type:"string",
                                                },
                                                "isCustom":{
                                                    type:"boolean",
                                                    description:"True if the category is custom, otherwise false"
                                                },
                                                "createdAt":{
                                                    type:"string",
                                                    format:"date-time",
                                                },
                                                "updatedAt":{
                                                    type:"string",
                                                    format:"date-time",
                                                },
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        404:{
                            description:"User not found"
                        },
                        500:{
                            description:"Unknown error"
                        }
                    }
                }
            },
            "profile/get/overview":{//OK
                get:{
                    tags:["Profile"],
                    summary:"Route to get the overview data of an user. (REMEMBER AUTH TOKEN)",
                    description:"It receives the username of the user than returns the total_habit_count and detailed_habit_count properties of the user.",
                    security:[{"BearerAuth":[]}],
                    responses:{
                        200:{
                            description:"Success.",
                            content:{
                                "application/json":{
                                    schema:{
                                        properties:{
                                            "totalHabitCount":{
                                                type:"number",
                                                description:"The total number of habits done."
                                            },
                                            "overview":OverviewSchema,
                                        }
                                    }
                                }
                            }
                        },
                        404:{
                            description:"The profile was not found."
                        },
                        500:{
                            description:"Unknow error."
                        }
                    }
                }
            },
            "profile/get/habits":{//OK
                get:{
                    tags:["Profile"],
                    summary:"Route to get the habits of an user.",
                    security:[{"BearerAuth":[]}],
                    description:"It will get the habits of the logged user. Use auth token",
                    responses:{
                        200:{
                            description:"Success",
                            content:{
                                "application/json":{
                                    schema:HabitSchema
                                }
                            }
                        },
                        404:{
                            description:"User not found (most likely impossible)",
                        },
                        500:{
                            description:"Unknow error"
                        }
                    }
                }
            },
            "profile/get/goals":{//OK
                get:{
                    tags:["Profile"],
                    summary:"Route to get the goals of an user.",
                    security:[{"BearerAuth":[]}],
                    description:"It will get the goals of the logged user. Use auth token",
                    responses:{
                        200:{
                            description:"Success",
                            content:{
                                "application/json":{
                                    schema:{
                                        properties:{
                                            "id":{
                                                description:"The goal id"
                                            },
                                            "title":{
                                                description:"The goal title"
                                            },
                                            "createdAt":{
                                                type:"string",
                                                format:"date-time",
                                            },
                                            "updatedAt":{
                                                type:"string",
                                                format:"date-time",
                                            },
                                            "targetCount":{
                                                type:"number",
                                                description:"The target count of the goal"
                                            },
                                            "currentCount":{
                                                type:"number",
                                                description:"The current count of the goal"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        404:{
                            description:"User not found (most likely impossible)",
                        },
                        500:{
                            description:"Unknow error"
                        }
                    }
                }
            },
            "delete/image":{
                delete:{
                    tags:["Delete"],
                    summary:"Route to delete the profile image of the user",
                    security:[{"BearerAuth":[]}],
                    description:"Route to delete the profile image of the user",
                    responses:{
                        201:{
                            description:"Deleted"
                        },
                        404:{
                            description:"User was not found"
                        },
                        500:{
                            description:"Unknown error"
                        }
                    }
                }
            },            
            "user/register":{//OK
                post:{
                    tags:["User"],
                    summary:"Route to create a new user",
                    description:"Creates an new user, which will have an unvalidated status. User must validate it's account, an email will be sent with a link to the user.",
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
            "user/recover/sendCode":{//OK
                post:{
                    tags:["User"],
                    summary:"Route to send the recover email with the code.",
                    description:"This route sends an email with an code to the user who's email was informed. Also sents an cookie in the reply.",
                    responses:{
                        201:{
                            description:"Success, code sent.",
                            headers:{
                                "Set-Cookie":{
                                    description:"The cookie containing the 6 digit code.",
                                    schema:{
                                        type:"string",
                                    }
                                }
                            }
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
            "user/recover/validate":{//OK
                patch:{
                    tags:["User"],
                    summary:"Route that validates the recover code.",
                    description:"This route recieves the code of the user, the recover cookies and validates them.",
                    parameters:[{
                        name:"recoverCookie",
                        in:"cookie",
                        required:true,
                        schema:{
                            type:"string"
                        },
                        description:"The recover cookie"
                    }],
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    properties:{
                                        "code":{
                                            description:"The code that the user received"
                                        },
                                    },
                                    required:["code"],
                                },
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Success, password changed.",
                            content:{
                                "application/json":{
                                    schema:{
                                        properties:{
                                            "token":{
                                                description:"Token to be used on the user/recover route."
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        400:{
                            description:"The code was incorrect."
                        },
                        401:{
                            description:"The cookie was expired or the cookie was invalid.",
                        },
                        404:{
                            description:"The user was somehow not found.(The user data is in the token.)"
                        },
                        500:{
                            description:"Unknown error."
                        }
                    }
                }
            },
            "user/recover":{//OK
                patch:{
                    tags:["User"],
                    summary:"Route that ends the recover password process.",
                    description:"This route receives an token and the new password.It will validate the token, if succeeds, than changes the user password to the new one.",
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    properties:{
                                        "newPassword":{
                                            description:"The user's new password"
                                        },
                                        "email":{
                                            description:"The email of the user"
                                        },
                                        "token":{
                                            description:"The code that the user received"
                                        },
                                    },
                                    required:["token","email","newPassword"],
                                },
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Success, password changed."
                        },
                        400:{
                            description:"The token was invalid."
                        },
                        404:{
                            description:"The user was somehow not found."
                        },
                        500:{
                            description:"Unknown error."
                        }
                    }
                }
            },
            "user/get":{//OK
                get:{
                    tags:["User"],
                    summary:"Route to get the user data. Requires Auth token.",
                    security:[{"BearerAuth":[]}],
                    responses:{
                        200:{
                            description:"Success",
                            content:{
                                "application/json":{
                                    example:{
                                        "username":"John Doe",
                                        "email":"johndoe123@email.com",
                                        "imageUrl":"freeimages.com/cats"
                                    },
                                    schema:{
                                        properties:{
                                            "username":{
                                                description:"The name of the user"
                                            },
                                            "email":{
                                                description:"The user email"
                                            },
                                            "imageUrl":{
                                                description:"The image url of the user's profile picture"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        404:{
                            description:"User was not found."
                        },
                        500:{
                            description:"Unknown error"
                        }
                    }
                }
            },
            "user/delete":{//OK
                delete:{
                    tags:["User"],
                    summary:"Route to delete an user. It deletes the logged user",
                    description:"Route to delete an user. Deletes the logged user.",
                    security:[{"BearerAuth":[]}],
                    responses:{
                        200:{
                            description:"Ok, deleted",
                        },
                        404:{
                            description:"User not found"
                        },
                        500:{
                            description:"Unknown error"
                        }
                    }
                }
            },
            "habit/create":{//OK
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
                                        "days":{
                                            type:"array",
                                            items:{
                                                type:"string",
                                            }
                                        },
                                        "title":{
                                            description:"The title of the habit"
                                        },
                                        "reminderTime":{
                                            type:"string",
                                            format:"date-time",
                                            description:"The moment (hour) that the reminder of the habit will happen."
                                        },
                                        "description":{
                                            description:"The description of the habit."
                                        },
                                        "categoryId":{
                                            description:"The id of the category of the habit (Must exists)."
                                        },
                                        "statusByDate":{
                                            type:"object",
                                        }
                                    },
                                    required:["title","category_id","statusByDate"],
                                }
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Habit created with success, returns the habit id.",
                            content:{
                                "application/json":{
                                    schema:HabitSchema
                                }
                            }
                        },
                        401:{
                            description:"No authorization was found in request.headers"
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
            "habit/delete/:habitId":{//OK
                delete:{
                    tags:["Habit"],
                    summary:"Route to delete an habit",
                    security:[{"BearerAuth":[]}],
                    parameters:[{
                        name:"habitId",
                        in:"path",
                        required:true,
                    }],
                    responses:{
                        200:{
                            description:"Ok, deleted",
                        },
                        403:{
                            description:"User does not own habit"
                        },
                        404:{
                            description:"User not found"
                        },
                        500:{
                            description:"Unknown error"
                        }
                    }
                }
            },
            "goal/create":{//OK
                post:{
                    tags:["Goal"],
                    summary:"",
                    security:[{"BearerAuth":[]}],
                    description:"",
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:GoalSchema,
                            },
                        }
                    },
                    responses:{
                        201:{
                            description:"Created",
                            content:{
                                "application/json":{
                                    schema:GoalSchema
                                }
                            }
                        },
                        404:{
                            description:"The user was not found (most likely impossible)"
                        },
                        500:{
                            description:"Unknow error"
                        }
                    },
                }
            },
            "goal/delete/:goalId":{//OK
                delete:{
                    tags:["Goal"],
                    summary:"Route to delete an goal",
                    security:[{"BearerAuth":[]}],
                    parameters:[{
                        name:"goalId",
                        in:"path",
                        required:true
                    }],
                    responses:{
                        200:{
                            description:"Ok, deleted",
                        },
                        403:{
                            description:"User does not own goal"
                        },
                        404:{
                            description:"User not found"
                        },
                        500:{
                            description:"Unknown error"
                        }
                    }
                }
            },
            "category/create":{//OK
                post:{
                    tags:["Category"],
                    summary:"Create category",
                    security:[{"BearerAuth":[]}],
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:CategorySchema
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Habit created with success, returns the habit id.",
                            content:{
                                "application/json":{
                                    schema:CategorySchema
                                }
                            }
                        },
                        403:{
                            description:"The category's name is already in use."
                        },
                        404:{
                            description:"User was not found."
                        },
                        500:{
                            description:"Unknown error."
                        }
                    }
                }
            },
            "category/delete/:categoryId":{//OK
                delete:{
                    tags:["Category"],
                    summary:"Route to delete an category",
                    security:[{"BearerAuth":[]}],
                    parameters:[{
                        name:"categoryId",
                        in:"path",
                        required:true
                    }],
                    responses:{
                        200:{
                            description:"Ok, deleted",
                        },
                        403:{
                            description:"User does not own category"
                        },
                        404:{
                            description:"User not found"
                        },
                        500:{
                            description:"Unknown error"
                        }
                    }
                }
            },
            "upload/image":{//OK
                post:{
                    tags:["Upload"],
                    summary:"Route to upload an profile image to the user (CHECK PARAMETERS DESCRIPTION)",
                    security:[{"BeaererAuth":[]}],
                    requestBody:{
                        content:{
                            "multipart/form-data":{
                                schema:{
                                    properties:{
                                        "file":{
                                            description:"The image"
                                        },
                                    },
                                    required:["file"]
                                }
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Image uploaded",
                            content:{
                                "application/json":{
                                    schema:{
                                        properties:{
                                            "image_url":{
                                                description:"The url of the image."
                                            }
                                        },
                                    }
                                }
                            }
                        },
                        401:{
                            description:"No api_auth was found in request.headers"
                        },
                        404:{
                            description:"The user was not found.(Most likely impossible to happen)"
                        },
                        500:{
                            description:"Unknown error"
                        }
                    }
                }
            },
            "update/overview":{//OK
                patch:{
                    tags:["Update"],
                    summary:"Route to update an overview",
                    description:"Route to update an overview, keep in mind that here the days are nullable, making possible to update one day per time. Use auth token.",
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
                        401:{
                            description:"No authorization was found in request.headers"
                        },
                        404:{
                            description:"It was not possible to find the profile (this error is supposed to be impossible!)"
                        },
                        500:{
                            description:"Unknown error"
                        },
                    }
                }
            },
            "update/username":{//OK
                patch:{
                    tags:["Update"],
                    summary:"Route to edit username",
                    description:"Route to edit the username of an logged user. Use auth token.",
                    security:[{"BearerAuth":[]}],
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    type:"object",
                                    properties:{
                                        "oldUsername":{ description:"The old username" },
                                        "newUsername":{ description:"The new username" },
                                    },
                                    required:["oldUsername","newUsername"],
                                }
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Success, username changed."
                        },
                        400:{
                            description:"The old_username does not belong to the user."
                        },
                        401:{
                            description:"No authorization was found in request.headers"
                        },
                        404:{
                            description:"The user (this is pretty much impossible) or the old_username was not found."
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
            "update/password":{//OK
                patch:{
                    tags:["Update"],
                    summary:"Route to change the password. (REMEMBER USING AUTH TOKEN)",
                    security:[{"BearerAuth":[]}],
                    description:"Changes the password of an logged user.",
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    properties:{
                                        "oldPassword":{ description:"User's old password" },
                                        "newPassword":{ description:"The new password"}
                                    },
                                    required:["oldPassword","newPassword"],
                                },
                            },
                        },
                    },
                    responses:{
                        201:{
                            description:"Password changed"
                        },
                        401:{
                            description:"No authorization was found in request.headers"
                        },
                        403:{
                            description:"Incorrect Password"
                        },
                        404:{
                            description:"The user was not found. (This is pretty much impossible)"
                        },
                        500:{
                            description:"Unknown error"
                        }
                    },
                }
            },
            "update/total/:number":{//OK
                patch:{
                    tags:["Update"],
                    security:[{"BearerAuth":[]}],
                    summary:"Route to update the total habit count of an user",
                    description:"Route that updates the total habit count of an logged user. Use auth token.",
                    parameters:[{
                        name:"number",
                        in:"path",
                        required:true,
                        description:"The new total number.",
                        schema:{
                            type:"number"
                        }
                    }],
                    responses:{
                        201:{
                            description:"Updated successfully.",
                        },
                        404:{
                            description:"User not found."
                        },
                    }
                }
            },
            "update/email/request":{//OK ALERT
                patch:{
                    tags:["Update"],
                    summary:"Route to edit email",
                    description:"Route to edit the email of an logged user. Use auth token.",
                    security:[{"BearerAuth":[]}],
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    type:"object",
                                    properties:{
                                        "password":{ description:"User's password" },
                                        "newEmail":{ description:"The old email" },
                                        "oldEmail":{ description:"The new email" },
                                    },
                                    required:["oldEmail","newEmail"],
                                },
                            },
                        },
                    },
                    responses:{
                        201:{
                            description:"Success, email changed."
                        },
                        400:{
                            description:"The old_email does not belong to the user"
                        },
                        401:{
                            description:"No authorization was found in request.headers"
                        },
                        403:{
                            description:"Incorrect password"
                        },
                        404:{
                            description:"The user or the old_email was not found"
                        },
                        409:{
                            description:"The new_email is already in use"
                        },
                        500:{
                            description:"Unknown error"
                        },
                    }
                }
            },
            "update/email/validate":{
                patch:{
                    tags:["Update"],
                    summary:"Route to validate the update email token.",
                    security:[{"BearerAuth":[]}],
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    properties:{
                                        "token":{
                                            description:"The token sent to the user by email."
                                        }
                                    },
                                    required:["token"]
                                }
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Email updated"
                        },
                        400:{
                            description:"The auth token does not doesn't belong to the user of the token"
                        },
                        404:{
                            description:"User not found"
                        },
                        500:{
                            description:"Unknown error"
                        }
                    }
                }
            },
            "update/habit/status/:habitId":{//OK
                patch:{
                    tags:["Update"],
                    summary:"Update habit status",
                    security:[{"BearerAuth":[]}],
                    parameters:[{
                        name:"habitId",
                        in:"path",
                        required:true,
                    }],
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    type:"object",
                                    properties:{
                                        "date":{
                                            type:"string",
                                            description:"The date of the status",
                                            example:"2025-06-07"
                                        },
                                        "status":{
                                            type:"string",
                                            description:"The object that has the specified date will have it's status updated to this.",
                                            enum:[
                                                "unstarted",
                                                "concluded",
                                                "missed",
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Updated",
                            content:{
                                "application/json":{
                                    schema:HabitSchema
                                }
                            }
                        },
                        403:{
                            description:"User does not own the habit."
                        },
                        404:{
                            description:"User or habit or category not found. Check the message to know which."
                        },
                        500:{
                            description:"Unknow error"
                        }
                    },
                }
            },
            "update/habit/:habitId":{//OK
                put:{
                    tags:["Update"],
                    summary:"Route to edit an habit",
                    security:[{"BearerAuth":[]}],
                    description:"Route to edit all the information of an habit except status.Except habit_id, every property is OPTIONAL.",
                    parameters:[{
                        in:"path",
                        name:"habitId",
                        required:true
                    }],
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    properties:{
                                        "title":{
                                            description:"The title of the habit"
                                        },
                                        "days":{
                                            type:"array",
                                            items:{
                                                type:"string",
                                            },
                                        },
                                        "reminder_time":{
                                            type:"string",
                                            format:"date-time",
                                            description:"The moment (hour) that the reminder of the habit will happen."
                                        },
                                        "description":{
                                            description:"The description of the habit."
                                        },
                                        "category_id":{
                                            description:"The name of the category of the habit (Must exists)."
                                        },
                                        "statusByDate":{
                                            type:"object"
                                        }
                                    },
                                    required:["habit_id"]
                                }
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Updated",
                            content:{
                                "application/json":{
                                    schema:HabitSchema
                                }
                            }
                        },
                        403:{
                            description:"User does not own the habit."
                        },
                        404:{
                            description:"User or habit or category not found. Check the message to know which."
                        },
                        500:{
                            description:"Unknow error"
                        }
                    }
                }
            },
            "update/goal/:goalId":{//OK
                patch:{
                    tags:["Update"],
                    summary:"Route to update an goal",
                    security:[{"BearerAuth":[]}],
                    parameters:[{
                        in:"path",
                        name:"goalId",
                        required:true
                    }],
                    requestBody:{
                        content:{
                            "application/json":{
                                schema:{
                                    properties:{
                                        "new_title":{
                                            description:"The new name of the goal"
                                        },
                                        "target_count":{
                                            type:"number",
                                            description:"The target count"
                                        },
                                        "current_count":{
                                            type:"number",
                                            description:"current count"
                                        }
                                    },
                                    required:["goal_id","new_title","current_count","target_count"]
                                }
                            }
                        }
                    },
                    responses:{
                        201:{
                            description:"Updated",
                            content:{
                                "application/json":{
                                    schema:GoalSchema
                                }
                            }
                        },
                        403:{
                            description:"The user does not own the goal"
                        },
                        404:{
                            description:"The user or the goal was not found"
                        },
                        500:{
                            description:"Unknown error"
                        }
                    }
                }
            },
        },
    },
    transform:jsonSchemaTransform,
}