---
layout: post
title: Hello World (Randomly)
tags: java, random
---

Three years ago I posted the following code as a Gist. It is still rather intriguing, so I've decided to dig into it
and explain why it works.

{% highlight java %}
import java.util.Random;

public class NotRandom {

	public static void main(String[] args) {
	    String hello = randomString(0xf24ab354);
	    String world = randomString(0xf72f13ef);

	    //Prints "hello world"
		System.out.println(hello+' '+world);
	}

	public static String randomString(int seed) {
		Random rand = new Random(seed);
		StringBuilder sb = new StringBuilder();
		int n;
		while(0!=(n=rand.nextInt(27))) sb.append((char) ('`'+n));
		return sb.toString();
	}
}
{% endhighlight %}