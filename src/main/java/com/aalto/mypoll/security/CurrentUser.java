package com.aalto.mypoll.security;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.lang.annotation.*;

/**
 * The @AuthenticationPrincipal can be used to access the currenctly authenticated user in the controllers,
 * the CurrentUser annoation is a wrapper around the @AuthenticationPrincipal
 */
@Target({ElementType.PARAMETER, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@AuthenticationPrincipal
public @interface CurrentUser {

}