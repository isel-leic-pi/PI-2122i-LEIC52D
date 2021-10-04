class Person {
    final int id;
    public Person() {
        this.id = 781364;
    }
}

public class App {
    public static void main(String [] args) {
        Person p = new Person();
        System.out.println("Person id " + p.id);
        /*
         * !!!!! Compilation Error !!!!
         */
        // System.out.println("Person id " + p.name); 
    }
}