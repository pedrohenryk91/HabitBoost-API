import{ SwaggerOptions } from "@fastify/swagger";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import { DetailedHabitCountSchema } from "lib/types/DetailedHabitCount";

export const SwaggerDocumentationOptions:SwaggerOptions = {
    openapi:{
        info:{
            title:"HabitBoostAPI",
            description:"The API of the HabitBoost App",
            version:"0.0.1",
        },
        paths:{
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
                                            description:"The date the profile was created at, must ignore if creating an new profile" },
                                        "updated_at":{ description:"The date that the profile was updated by the last time,  must ignore if creating an new profile" },
                                        "total_habit_count":{ description:"The total number of habits concluded by the user, must ignore if creating an new profile" },
                                        "detailed_habit_count":{ 
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
                    responses:{
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
                                        "profileId":{ description:"The profile's id, which will get connected to the user's account. (Optional)"}
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
            "user/validate/sendToken":{
                post:{
                    tags:["User"],
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
                        404:{
                            description:"The email was not found on the database."
                        },
                        500:{
                            description:"Unknown error"
                        },
                    },
                }
            },
            "user/validate/verifyToken":{
                patch:{
                    tags:["User"],
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
                                    }
                                }
                            }
                        }
                    },
                    responses:{
                        404:{
                            description:"If this code appears, it means that the user id was not found. "
                        },
                        500:{
                            description:"Unspecified error."
                        }
                    }
                }
            },
            "user/recover/validate":{

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
        }
    },
    transform:jsonSchemaTransform,
}